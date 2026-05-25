const fs = require('fs');
const path = require('path');

// 1. Parse .env file
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check configuration
if (!token || !supabaseUrl || !supabaseKey) {
  console.error("⚠️ Xatolik: .env faylida zarur sozlamalar etishmayapti!");
  console.error(`- VITE_TELEGRAM_BOT_TOKEN: ${token ? '✅' : '❌'}`);
  console.error(`- VITE_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`);
  console.error(`- VITE_SUPABASE_PUBLISHABLE_KEY/SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? '✅' : '❌'}`);
  process.exit(1);
}

const allowedUsers = (process.env.ALLOWED_TELEGRAM_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

console.log("🤖 ISCAD Telegram Bot ishga tushdi...");
console.log(`Allowed Users List: [${allowedUsers.join(', ')}]`);

// State management
const userStates = {};

// Ensure buckets exist on startup
(async () => {
  await ensureBucketExists('journal-pdfs');
  await ensureBucketExists('journal-covers');
})();

async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`Message send failed: ${res.statusText}`);
    }
  } catch (e) {
    console.error("Error sending message:", e);
  }
}

async function downloadTelegramFile(fileId) {
  const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
  const fileData = await fileRes.json();
  if (!fileData.ok) throw new Error("Telegram'dan fayl yo'li olib bo'lmadi");
  
  const filePath = fileData.result.file_path;
  const downloadRes = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  const arrayBuffer = await downloadRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToSupabase(bucket, filePath, buffer, contentType) {
  const cleanPath = filePath.replace(/[^a-zA-Z0-9_./-]/g, '_');
  const res = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${cleanPath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': contentType,
    },
    body: buffer,
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase yuklash xatosi (${res.status}): ${errText}`);
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

async function ensureBucketExists(bucket) {
  try {
    const checkRes = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      }
    });
    
    if (checkRes.status === 200) {
      console.log(`Bucket exists: ${bucket}`);
      return;
    }
    
    console.log(`Bucket not found. Creating: ${bucket}...`);
    const createRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
      })
    });
    
    if (createRes.ok) {
      console.log(`Successfully created bucket: ${bucket}`);
    } else {
      const errText = await createRes.text();
      console.error(`Failed to create bucket ${bucket}: ${errText}`);
    }
  } catch (e) {
    console.error(`Error checking/creating bucket ${bucket}:`, e);
  }
}

async function insertJournal(journal) {
  const res = await fetch(`${supabaseUrl}/rest/v1/journals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(journal),
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Database xatosi (${res.status}): ${errText}`);
  }
  
  const data = await res.json();
  return data[0];
}

async function handleUpdate(update) {
  if (!update.message) return;
  
  const msg = update.message;
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  const text = msg.text;

  // Handle /my_id and /id (allow anyone)
  if (text === '/my_id' || text === '/id' || text === '/start') {
    if (text === '/start' && allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
      // Let start message fall through to security message or greeting
    } else {
      await sendTelegramMessage(chatId, `Sizning Telegram ID: \`${userId}\`\n\nYangi jurnal yuborish uchun PDF faylni botga yuboring.`);
      return;
    }
  }

  // 1. Security Check
  if (allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
    await sendTelegramMessage(
      chatId, 
      `⚠️ *Sizda ruxsat yo'q.*\n\nSizning Telegram ID: \`${userId}\`\n\nUshbu ID'ni faollashtirish uchun loyihadagi \`.env\` fayliga qo'shing:\n\`ALLOWED_TELEGRAM_IDS=${userId}\` va botni qayta ishga tushiring.`
    );
    return;
  }

  // Handle /cancel
  if (text === '/cancel') {
    delete userStates[chatId];
    await sendTelegramMessage(chatId, "❌ Nashr yuklash bekor qilindi. Yangi boshlash uchun PDF fayl yuboring.");
    return;
  }

  const state = userStates[chatId];

  // 2. State-based Flow
  if (!state) {
    // If no active session, wait for document or show start info
    if (msg.document) {
      if (msg.document.mime_type !== 'application/pdf') {
        await sendTelegramMessage(chatId, "⚠️ Iltimos, faqat *PDF* formatidagi jurnal faylini yuboring.");
        return;
      }

      await sendTelegramMessage(chatId, "⏳ Fayl yuklab olinmoqda, kuting...");
      try {
        const buffer = await downloadTelegramFile(msg.document.file_id);
        userStates[chatId] = {
          step: 'waiting_for_title',
          pdfBuffer: buffer,
          pdfFileName: msg.document.file_name || `jurnal_${Date.now()}.pdf`,
        };
        await sendTelegramMessage(chatId, "📥 PDF fayl qabul qilindi.\n\nEndi jurnalning *sarlavhasini (Title)* kiriting:\n_(Bekor qilish uchun /cancel deb yozing)_");
      } catch (e) {
        console.error(e);
        await sendTelegramMessage(chatId, `❌ Fayl yuklashda xatolik yuz berdi: ${e.message}`);
      }
    } else {
      await sendTelegramMessage(
        chatId, 
        `👋 *Assalomu alaykum!*\n\nBu ISCAD ilmiy jurnallarini veb-saytga yuklash rasmiy boti.\n\nYangi jurnal nashrini yuklash uchun menga *PDF fayl* yuboring.`
      );
    }
  } else if (state.step === 'waiting_for_title') {
    if (!text || text.startsWith('/')) {
      await sendTelegramMessage(chatId, "⚠️ Iltimos, jurnal uchun to'g'ri sarlavha kiriting:");
      return;
    }
    state.title = text;
    state.step = 'waiting_for_desc';
    await sendTelegramMessage(chatId, `✅ Sarlavha qabul qilindi: *"${text}"*\n\nEndi jurnal uchun *tavsif (Description/Abstract)* kiriting.\nAgar tavsif bo'lmasa, /skip buyrug'ini yuboring:`);
  } else if (state.step === 'waiting_for_desc') {
    state.description = text === '/skip' ? null : text;
    state.step = 'waiting_for_cover';
    await sendTelegramMessage(chatId, "🖼️ Tavsif qabul qilindi.\n\nEndi jurnal *muqovasi (Cover Image)* uchun rasm yuboring (JPG/PNG).\nAgar muqova rasmi bo'lmasa, /skip buyrug'ini yuboring:");
  } else if (state.step === 'waiting_for_cover') {
    let coverBuffer = null;
    let coverFileName = null;

    if (msg.photo && msg.photo.length > 0) {
      await sendTelegramMessage(chatId, "⏳ Muqova rasmi yuklab olinmoqda...");
      try {
        const photo = msg.photo[msg.photo.length - 1]; // get highest resolution
        coverBuffer = await downloadTelegramFile(photo.file_id);
        coverFileName = `cover_${Date.now()}.jpg`;
      } catch (e) {
        console.error(e);
        await sendTelegramMessage(chatId, `⚠️ Rasm yuklab olishda xatolik yuz berdi. Jurnal rasmsiz yuklanadi.`);
      }
    } else if (text !== '/skip') {
      await sendTelegramMessage(chatId, "⚠️ Iltimos, rasm yuboring yoki /skip yozing:");
      return;
    }

    await sendTelegramMessage(chatId, "⏳ Supabase tizimiga ma'lumotlar yuklanmoqda, iltimos kuting...");
    
    try {
      // 1. Upload PDF
      const pdfPath = `journals/${Date.now()}_${state.pdfFileName}`;
      const pdfUrl = await uploadToSupabase('journal-pdfs', pdfPath, state.pdfBuffer, 'application/pdf');

      // 2. Upload Cover (if exists)
      let coverUrl = null;
      if (coverBuffer) {
        const coverPath = `covers/${Date.now()}_${coverFileName}`;
        coverUrl = await uploadToSupabase('journal-covers', coverPath, coverBuffer, 'image/jpeg');
      }

      // 3. Insert to database
      const record = await insertJournal({
        title: state.title,
        description: state.description,
        pdf_url: pdfUrl,
        cover_image_url: coverUrl
      });

      await sendTelegramMessage(
        chatId,
        `🎉 *Muvaffaqiyatli yuklandi!*\n\n` +
        `📖 *Sarlavha:* ${record.title}\n` +
        `📝 *Tavsif:* ${record.description || "Kiritilmagan"}\n` +
        `🔗 *Fayl URL:* [Yuklab olish](${record.pdf_url})\n\n` +
        `Jurnal saytning *3D Virtual Javonida* avtomatik ravishda chop etildi! 🚀`
      );
    } catch (e) {
      console.error(e);
      await sendTelegramMessage(
        chatId, 
        `❌ Yuklashda xatolik yuz berdi!\n\n` +
        `*Sababi:* ${e.message}\n\n` +
        `⚠️ Agar ruxsat xatosi (401/403) bo'lsa, .env faylingizga *SUPABASE_SERVICE_ROLE_KEY* qo'shilganini tekshiring.`
      );
    } finally {
      delete userStates[chatId];
    }
  }
}

// Long polling loop
let offset = 0;
async function pollUpdates() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`);
      if (!res.ok) {
        console.error(`Telegram API xatosi: ${res.statusText}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (e) {
      console.error("Polling xatolik:", e);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

pollUpdates();
