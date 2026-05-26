const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const NodeCache = require('node-cache');
const sharp = require('sharp');
const { encode } = require('blurhash');

// Initialize in-memory cache with 24 hours TTL (86400 seconds)
const imageCache = new NodeCache({ stdTTL: 86400 });

// Helper function to generate blurhash string from image buffer
async function generateBlurhash(buffer) {
  try {
    const { data, info } = await sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    return encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4,
      4
    );
  } catch (err) {
    console.error('Error generating blurhash:', err);
    return null;
  }
}

// Configure multer for in-memory file handling
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // Limit to 50MB


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

// Setup Admin Account automatically on boot only if service role key is present
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  setupAdminAccount();
} else {
  console.log("ℹ️ SUPABASE_SERVICE_ROLE_KEY topilmadi, admin hisobini avtomatik sozlash o'tkazib yuborildi.");
}

async function setupAdminAccount() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'Admin1234';

  try {
    console.log("🔒 Admin akkauntini tekshirish...");
    
    // Check if user exists in auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("⚠️ Supabase user list fetch failed. Make sure SUPABASE_SERVICE_ROLE_KEY is set correctly:", listError);
      return;
    }

    let adminUser = users.find(u => u.email === adminEmail);

    if (!adminUser) {
      console.log("➕ Admin foydalanuvchisi topilmadi. Yaratilmoqda...");
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Admin' }
      });

      if (createError) {
        console.error("❌ Admin user creation failed:", createError);
        return;
      }
      adminUser = user;
      console.log(`✅ Admin foydalanuvchisi yaratildi: ID = ${adminUser.id}`);
    } else {
      console.log("ℹ️ Admin foydalanuvchisi allaqachon mavjud.");
    }

    // Ensure profile exists and has 'admin' role in the database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (profileError || !profile) {
      console.log("➕ Admin profili yaratilmoqda...");
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: adminUser.id,
          full_name: 'Admin',
          role: 'admin'
        });
      if (insertError) console.error("❌ Error creating admin profile:", insertError);
      else console.log("✅ Admin profili 'admin' roli bilan yaratildi.");
    } else if (profile.role !== 'admin') {
      console.log("🔄 Profil roli 'admin' ga yangilanmoqda...");
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
      if (updateError) console.error("❌ Error updating admin profile role:", updateError);
      else console.log("✅ Profil roli 'admin' ga o'zgartirildi.");
    } else {
      console.log("✅ Admin profili va roli allaqachon to'g'ri sozlangan.");
    }

  } catch (err) {
    console.error("❌ setupAdminAccount'da kutilmagan xatolik:", err);
  }
}

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
// Helper to stream a file from Telegram Bot API using its fileId
function streamTelegramFile(fileId, res) {
  // Check if we have this file optimized in cache first (if it's an image, it will be cached as image/webp)
  const cachedImage = imageCache.get(`image:${fileId}`);
  if (cachedImage) {
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours browser cache
    return res.send(cachedImage);
  }

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

        // Determine if it is an image
        const isImage = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png');

        if (isImage) {
          // If it is an image, download the buffer, optimize it, cache, and serve
          https.get(downloadUrl, (fileStream) => {
            const chunks = [];
            fileStream.on('data', (chunk) => chunks.push(chunk));
            fileStream.on('end', async () => {
              try {
                const rawBuffer = Buffer.concat(chunks);

                // 1. Optimize image (convert to WebP, shrink to max 400px width)
                const optimizedBuffer = await sharp(rawBuffer)
                  .resize({ width: 400, withoutEnlargement: true })
                  .webp({ quality: 80 })
                  .toBuffer();

                // 2. Generate blurhash in background (does not block serving)
                generateBlurhash(rawBuffer).then((blurhash) => {
                  if (blurhash) {
                    sharp(optimizedBuffer).metadata().then((meta) => {
                      const width = meta.width || 400;
                      const height = meta.height || 300;
                      imageCache.set(`metadata:${fileId}`, { blurhash, width, height });
                    });
                  }
                }).catch(err => console.error("Error generating blurhash:", err));

                // 3. Cache the optimized WebP buffer
                imageCache.set(`image:${fileId}`, optimizedBuffer);

                // 4. Send response
                res.setHeader('Content-Type', 'image/webp');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                res.send(optimizedBuffer);
              } catch (err) {
                console.error("Error processing image with sharp:", err);
                // Fallback to serving raw chunks if sharp fails
                res.setHeader('Content-Type', 'image/jpeg');
                res.send(Buffer.concat(chunks));
              }
            });
          }).on('error', (streamErr) => {
            console.error("Image download error:", streamErr);
            res.status(500).json({ error: "Error downloading image from Telegram" });
          });
        } else {
          // Determine content type for non-image files (like PDFs)
          let contentType = 'application/octet-stream';
          if (filePath.endsWith('.pdf')) {
            contentType = 'application/pdf';
          }

          // Stream file content directly
          https.get(downloadUrl, (fileStream) => {
            if (fileStream.headers['content-length']) {
              res.setHeader('Content-Length', fileStream.headers['content-length']);
            }
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
            fileStream.pipe(res);
          }).on('error', (streamErr) => {
            console.error("Stream error:", streamErr);
            res.status(500).json({ error: "Error streaming file content from Telegram" });
          });
        }

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

// Endpoint to fetch metadata (blurhash, width, height) of an image cover
app.get('/api/file/metadata/:fileId', async (req, res) => {
  const { fileId } = req.params;

  // 1. Check if metadata is in cache
  const cachedMeta = imageCache.get(`metadata:${fileId}`);
  if (cachedMeta) {
    return res.json(cachedMeta);
  }

  // 2. If not, fetch and generate metadata
  const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;

  https.get(getFileUrl, (telegramRes) => {
    let data = '';
    telegramRes.on('data', (chunk) => { data += chunk; });
    telegramRes.on('end', () => {
      try {
        const fileInfo = JSON.parse(data);
        if (!fileInfo.ok) {
          return res.status(404).json({ error: "Telegram file not found" });
        }

        const filePath = fileInfo.result.file_path;
        const isImage = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png');

        if (!isImage) {
          return res.status(400).json({ error: "Requested file is not an image" });
        }

        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

        https.get(downloadUrl, (fileStream) => {
          const chunks = [];
          fileStream.on('data', (chunk) => chunks.push(chunk));
          fileStream.on('end', async () => {
            try {
              const rawBuffer = Buffer.concat(chunks);

              // Optimize and get dimensions
              const optimizedBuffer = await sharp(rawBuffer)
                .resize({ width: 400, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();

              const blurhash = await generateBlurhash(rawBuffer);
              const meta = await sharp(optimizedBuffer).metadata();
              
              const metaData = {
                blurhash: blurhash || "L6PZES9F00%M00WBq_?b00Rj~q_3", // default placeholder blurhash if failed
                width: meta.width || 400,
                height: meta.height || 300
              };

              // Cache both optimized image and metadata
              imageCache.set(`image:${fileId}`, optimizedBuffer);
              imageCache.set(`metadata:${fileId}`, metaData);

              res.json(metaData);
            } catch (err) {
              console.error("Error generating image metadata:", err);
              res.status(500).json({ error: "Error processing image metadata" });
            }
          });
        }).on('error', (err) => {
          res.status(500).json({ error: "Error downloading image from Telegram" });
        });

      } catch (err) {
        res.status(500).json({ error: "Error parsing Telegram response" });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: "Failed to connect to Telegram Bot API" });
  });
});

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

// Upload endpoint for Telegram Web App
app.post('/api/upload-magazine', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  const { title, description, telegram_id } = req.body;
  
  if (!title || !req.files || !req.files['pdf']) {
    return res.status(400).json({ error: "Sarlavha va PDF fayl yuborilishi shart." });
  }

  // Security Check: Verify if uploader is in the allowed whitelist (if whitelist is not empty)
  if (allowedUsers.length > 0) {
    if (!telegram_id || !allowedUsers.includes(String(telegram_id))) {
      return res.status(403).json({ error: "Sizda jurnallarni yuklash uchun ruxsat yo'q!" });
    }
  }

  try {
    const pdfFile = req.files['pdf'][0];
    const coverFile = req.files['cover'] ? req.files['cover'][0] : null;

    // Determine target chat to upload to:
    // 1. Specific channel/chat env 2. Uploader's telegram_id 3. First allowed user
    const targetChatId = process.env.TELEGRAM_STORAGE_CHAT_ID || telegram_id || allowedUsers[0];
    
    if (!targetChatId) {
      return res.status(500).json({ error: "Faylni saqlash uchun maqsadli Telegram Chat ID aniqlanmadi." });
    }

    console.log(`📤 Web App'dan yangi jurnal yuklanmoqda... Target Chat: ${targetChatId}`);

    // 1. Upload PDF to Telegram Bot API
    const pdfFormData = new FormData();
    pdfFormData.append('chat_id', targetChatId);
    
    const pdfBlob = new Blob([pdfFile.buffer], { type: pdfFile.mimetype });
    pdfFormData.append('document', pdfBlob, pdfFile.originalname);

    const pdfTelegramRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: 'POST',
      body: pdfFormData
    });
    
    const pdfUploadResult = await pdfTelegramRes.json();
    if (!pdfUploadResult.ok) {
      console.error("Telegram PDF upload failed:", pdfUploadResult);
      return res.status(500).json({ error: `Telegram'ga PDF yuklashda xatolik: ${pdfUploadResult.description}` });
    }

    const pdfFileId = pdfUploadResult.result.document.file_id;

    // 2. Upload Cover Image to Telegram Bot API (if present)
    let coverFileId = null;
    if (coverFile) {
      const coverFormData = new FormData();
      coverFormData.append('chat_id', targetChatId);
      
      const coverBlob = new Blob([coverFile.buffer], { type: coverFile.mimetype });
      coverFormData.append('photo', coverBlob, coverFile.originalname);

      const coverTelegramRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: coverFormData
      });
      
      const coverUploadResult = await coverTelegramRes.json();
      if (coverUploadResult.ok) {
        const photos = coverUploadResult.result.photo;
        coverFileId = photos[photos.length - 1].file_id; // highest resolution
      } else {
        console.error("Telegram Cover upload failed:", coverUploadResult);
      }
    }

    // 3. Save entry to Supabase
    const pdfPublicUrl = `${backendUrl}/api/file/${pdfFileId}`;
    const coverPublicUrl = coverFileId ? `${backendUrl}/api/file/${coverFileId}` : null;

    const { data: record, error: dbError } = await supabase
      .from('journals')
      .insert({
        title: title,
        description: description || null,
        pdf_url: pdfPublicUrl,
        cover_image_url: coverPublicUrl
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return res.status(500).json({ error: `Ma'lumotlar bazasiga yozishda xatolik: ${dbError.message}` });
    }

    console.log(`✅ Jurnal muvaffaqiyatli saqlandi: ${title}`);
    res.json({ success: true, journal: record });

  } catch (err) {
    console.error("Internal upload error:", err);
    res.status(500).json({ error: "Server ichki xatoligi yuz berdi." });
  }
});

// Generic file upload to Telegram CDN endpoint
app.post('/api/upload-file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Fayl yuborilmadi." });
  }

  try {
    const file = req.file;
    const targetChatId = process.env.TELEGRAM_STORAGE_CHAT_ID || allowedUsers[0];
    
    if (!targetChatId) {
      return res.status(500).json({ error: "Faylni saqlash uchun Telegram Chat ID aniqlanmadi." });
    }

    console.log(`📤 Fayl Telegram CDN ga yuklanmoqda... (Hajmi: ${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    const formData = new FormData();
    formData.append('chat_id', targetChatId);

    const isImage = file.mimetype.startsWith('image/');
    let telegramEndpoint = 'sendDocument';
    let fileField = 'document';

    if (isImage) {
      telegramEndpoint = 'sendPhoto';
      fileField = 'photo';
    }

    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append(fileField, blob, file.originalname);

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/${telegramEndpoint}`, {
      method: 'POST',
      body: formData
    });

    const uploadResult = await telegramRes.json();
    if (!uploadResult.ok) {
      console.error("Telegram CDN upload failed:", uploadResult);
      return res.status(500).json({ error: `Telegram'ga yuklashda xatolik: ${uploadResult.description}` });
    }

    let fileId = '';
    if (isImage) {
      const photos = uploadResult.result.photo;
      fileId = photos[photos.length - 1].file_id; // highest resolution
    } else {
      fileId = uploadResult.result.document.file_id;
    }

    const filePublicUrl = `${backendUrl}/api/file/${fileId}`;
    res.json({ success: true, url: filePublicUrl, file_id: fileId });

  } catch (err) {
    console.error("Upload file error:", err);
    res.status(500).json({ error: "Faylni yuklashda server xatoligi yuz berdi." });
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
