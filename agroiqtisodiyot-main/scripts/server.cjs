const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
const port = process.env.PORT || 3000;

// Check configuration
if (!token || !supabaseUrl || !supabaseKey) {
  console.error("⚠️ Xatolik: .env faylida zarur sozlamalar etishmayapti!");
  process.exit(1);
}

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

const allowedUsers = (process.env.ALLOWED_TELEGRAM_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

const app = express();
app.use(express.json());

// CORS configuration middleware with dynamic origin validation
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv.split(',').map(o => o.trim()).filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    // If request has origin but not in whitelist, default to the first allowed origin
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// ============================================
// EXPRESS SERVER - STREAMING PROXY ENDPOINT
// ============================================

app.get('/', (req, res) => {
  res.send('🌌 ISCAD Telegram CDN Proxy Server is running...');
});

// Helper to stream a file from Telegram Bot API using its fileId
function streamTelegramFile(fileId, res) {
  const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
  
  https.get(getFileUrl, (telegramRes) => {
    let data = '';
    telegramRes.on('data', (chunk) => { data += chunk; });
    telegramRes.on('end', () => {
      try {
        const fileInfo = JSON.parse(data);
        if (!fileInfo.ok) {
          console.error(`Telegram getFile failed for fileId ${fileId}:`, fileInfo);
          return res.status(404).json({ error: "Telegram file not found" });
        }

        const filePath = fileInfo.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

        // Determine content type based on file extension
        let contentType = 'application/octet-stream';
        if (filePath.endsWith('.pdf')) {
          contentType = 'application/pdf';
        } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
          contentType = 'image/jpeg';
        } else if (filePath.endsWith('.png')) {
          contentType = 'image/png';
        }

        // Stream file content from Telegram to frontend client
        https.get(downloadUrl, (fileStream) => {
          // Copy important headers from Telegram if they exist
          if (fileStream.headers['content-length']) {
            res.setHeader('Content-Length', fileStream.headers['content-length']);
          }
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
          
          // Pipe the raw stream directly to response
          fileStream.pipe(res);
        }).on('error', (streamErr) => {
          console.error("Stream error:", streamErr);
          res.status(500).json({ error: "Error streaming file content from Telegram" });
        });

      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        res.status(500).json({ error: "Error parsing Telegram file response" });
      }
    });
  }).on('error', (err) => {
    console.error("Telegram API connection error:", err);
    res.status(500).json({ error: "Failed to connect to Telegram Bot API" });
  });
}

// Streaming proxy route by file ID directly
app.get('/api/file/:fileId', (req, res) => {
  const { fileId } = req.params;
  streamTelegramFile(fileId, res);
});

// Streaming proxy route by Supabase journal ID
app.get('/api/magazine/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch journal metadata from Supabase
    const { data: journal, error: dbError } = await supabase
      .from('journals')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !journal) {
      console.error("Supabase query error or journal not found:", dbError);
      return res.status(404).json({ error: "Journal not found in database" });
    }

    // 2. Extract Telegram file_id from the journal record.
    // We check:
    // a. direct 'telegram_file_id' or 'file_id' field if available (in case they customize columns)
    // b. parsed fileId from 'pdf_url' if it points to this proxy server (ends with /api/file/:fileId)
    // c. 'pdf_url' value directly if it is not an absolute HTTP URL (i.e. is a raw file_id)
    let fileId = journal.telegram_file_id || journal.file_id;

    if (!fileId && journal.pdf_url) {
      if (journal.pdf_url.includes('/api/file/')) {
        const parts = journal.pdf_url.split('/api/file/');
        fileId = parts[parts.length - 1];
      } else if (!journal.pdf_url.startsWith('http://') && !journal.pdf_url.startsWith('https://')) {
        fileId = journal.pdf_url;
      }
    }

    if (!fileId) {
      return res.status(400).json({ error: "No Telegram file_id could be resolved for this journal" });
    }

    // 3. Stream the file
    streamTelegramFile(fileId, res);

  } catch (err) {
    console.error("Internal Server Error in /api/magazine/:id:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Express Server
app.listen(port, () => {
  console.log(`🚀 Express server running at: http://localhost:${port}`);
  console.log(`📡 CDN URL pattern: ${backendUrl}/api/file/:fileId`);
});

// ============================================
// TELEGRAM BOT - METADATA COLLECTOR & INSERT
// ============================================

// State management for bot flow
const userStates = {};

async function sendTelegramMessage(chatId, text) {
  const body = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  });

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = https.request(options, (res) => {
    res.on('data', () => {});
  });
  req.on('error', (e) => {
    console.error("Bot sendMessage error:", e);
  });
  req.write(body);
  req.end();
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

  // Command /my_id and /id (allow anyone)
  if (text === '/my_id' || text === '/id' || text === '/start') {
    if (text === '/start' && allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
      // Let start flow through
    } else {
      await sendTelegramMessage(chatId, `Sizning Telegram ID: \`${userId}\`\n\nJurnal yuklash uchun PDF fayl yuboring.`);
      return;
    }
  }

  // Security Check
  if (allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
    await sendTelegramMessage(
      chatId, 
      `⚠️ *Sizda ruxsat yo'q.*\n\nSizning Telegram ID: \`${userId}\`\n\nUshbu ID'ni \`.env\` fayliga qo'shing:\n\`ALLOWED_TELEGRAM_IDS=${userId}\``
    );
    return;
  }

  // Handle /cancel
  if (text === '/cancel') {
    delete userStates[chatId];
    await sendTelegramMessage(chatId, "❌ Jurnal yuklash bekor qilindi. Boshlash uchun PDF yuboring.");
    return;
  }

  const state = userStates[chatId];

  if (!state) {
    // Stage 1: Document Upload
    if (msg.document) {
      if (msg.document.mime_type !== 'application/pdf') {
        await sendTelegramMessage(chatId, "⚠️ Iltimos, faqat *PDF* fayl yuboring.");
        return;
      }

      userStates[chatId] = {
        step: 'waiting_for_title',
        pdfFileId: msg.document.file_id,
        pdfFileName: msg.document.file_name || `jurnal_${Date.now()}.pdf`,
      };
      await sendTelegramMessage(chatId, "📥 PDF fayl (CDN) qabul qilindi.\n\nEndi jurnal uchun *Sarlavha (Title)* kiriting:\n_(Bekor qilish uchun /cancel yozing)_");
    } else {
      await sendTelegramMessage(chatId, "👋 *ISCAD Jurnallar Yuklash Boti.*\n\nJurnal qo'shish uchun *PDF fayl* yuboring.");
    }
  } else if (state.step === 'waiting_for_title') {
    if (!text || text.startsWith('/')) {
      await sendTelegramMessage(chatId, "⚠️ Iltimos, to'g'ri sarlavha kiriting:");
      return;
    }
    state.title = text;
    state.step = 'waiting_for_desc';
    await sendTelegramMessage(chatId, `✅ Sarlavha: *"${text}"*\n\nEndi jurnal *Tavsifini (Description)* kiriting yoki /skip yozing:`);
  } else if (state.step === 'waiting_for_desc') {
    state.description = text === '/skip' ? null : text;
    state.step = 'waiting_for_cover';
    await sendTelegramMessage(chatId, "📝 Tavsif saqlandi.\n\nEndi jurnal *Muqova rasmini (Cover Image)* yuboring yoki /skip yozing:");
  } else if (state.step === 'waiting_for_cover') {
    let coverFileId = null;

    if (msg.photo && msg.photo.length > 0) {
      coverFileId = msg.photo[msg.photo.length - 1].file_id; // highest res
    } else if (text !== '/skip') {
      await sendTelegramMessage(chatId, "⚠️ Iltimos, rasm yuboring yoki /skip yozing:");
      return;
    }

    await sendTelegramMessage(chatId, "⏳ Supabase ma'lumotlar bazasiga yozilmoqda...");

    try {
      // Create CDN proxy URLs for both resources
      const pdfPublicUrl = `${backendUrl}/api/file/${state.pdfFileId}`;
      const coverPublicUrl = coverFileId ? `${backendUrl}/api/file/${coverFileId}` : null;

      // Insert record to Supabase
      const record = await insertJournal({
        title: state.title,
        description: state.description,
        pdf_url: pdfPublicUrl,
        cover_image_url: coverPublicUrl
      });

      await sendTelegramMessage(
        chatId,
        `🎉 *Jurnal muvaffaqiyatli qo'shildi!*\n\n` +
        `📖 *Sarlavha:* ${record.title}\n` +
        `📥 *Telegram PDF URL (Proxy):* ${record.pdf_url}\n\n` +
        `Jurnal saytda avtomatik ravishda 3D javonda chiqdi! Fayllar to'g'ridan-to'g'ri Telegram CDN'dan stream qilinadi 🚀`
      );
    } catch (e) {
      console.error(e);
      await sendTelegramMessage(chatId, `❌ Xatolik yuz berdi: ${e.message}`);
    } finally {
      delete userStates[chatId];
    }
  }
}

// Telegram updates polling loop
let offset = 0;
async function pollUpdates() {
  while (true) {
    try {
      const getUpdatesUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`;
      https.get(getUpdatesUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.ok && result.result.length > 0) {
              for (const update of result.result) {
                offset = update.update_id + 1;
                handleUpdate(update);
              }
            }
          } catch (e) {
            console.error("Bot update parse error:", e);
          }
        });
      }).on('error', (err) => {
        console.error("Bot API Connection error:", err);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      console.error("Polling error:", e);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

pollUpdates();
