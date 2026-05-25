/**
 * AI Article Checker — Gemini API integration
 * Maqolalarni jurnal talablariga mosligini va imlo xatolarini tekshirish
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface SpellingError {
  word: string;
  suggestion: string;
  context: string;
}

export interface RequirementCheck {
  name: string;
  passed: boolean;
  details: string;
}

export interface ArticleCheckResult {
  overallScore: number; // 0-100
  spellingErrors: SpellingError[];
  grammarIssues: string[];
  requirementChecks: RequirementCheck[];
  suggestions: string[];
  summary: string;
}

/**
 * Local fallback checker to parse article requirements, word counts, and typical typos
 */
export function localCheckArticle(text: string): ArticleCheckResult {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const requirementChecks: RequirementCheck[] = [];
  let score = 100;

  // 1. Word count check
  const wordCountPassed = wordCount >= 3000;
  if (!wordCountPassed) score -= 15;
  requirementChecks.push({
    name: "Maqola hajmi (3000+ so'z)",
    passed: wordCountPassed,
    details: wordCountPassed 
      ? `Maqola hajmi yetarli (${wordCount} ta so'z).`
      : `Maqola hajmi kam (${wordCount} ta so'z). Jurnal talabi bo'yicha kamida 3000 ta so'z bo'lishi kerak.`
  });

  // 2. Annotatsiya check
  const hasAnnotation = /annotatsiya|abstract|аннотация|kirish|muqaddima/i.test(text);
  if (!hasAnnotation) score -= 15;
  requirementChecks.push({
    name: "Annotatsiya (Kirish)",
    passed: hasAnnotation,
    details: hasAnnotation
      ? "Annotatsiya yoki kirish qismi aniqlandi."
      : "Maqolada annotatsiya yoki kirish qismi topilmadi. Maqola kirish qismi bilan boshlanishi kerak."
  });

  // 3. Kalit so'zlar check
  const hasKeywords = /kalit\s+so'z|keywords|key\s+words|ключевые\s+слова/i.test(text);
  if (!hasKeywords) score -= 15;
  requirementChecks.push({
    name: "Kalit so'zlar (Keywords)",
    passed: hasKeywords,
    details: hasKeywords
      ? "Kalit so'zlar ro'yxati mavjud."
      : "Kalit so'zlar (keywords) topilmadi. Maqolada 5-8 ta kalit so'z bo'lishi lozim."
  });

  // 4. References check
  const hasReferences = /adabiyot|references|adabiyotlar\s+ro'yxati|список\s+литературы|foydalanilgan/i.test(text);
  if (!hasReferences) score -= 15;
  requirementChecks.push({
    name: "Adabiyotlar ro'yxati",
    passed: hasReferences,
    details: hasReferences
      ? "Foydalanilgan adabiyotlar yoki havolalar ro'yxati aniqlandi."
      : "Foydalanilgan adabiyotlar (References) ro'yxati topilmadi. Maqola oxirida manbalar ko'rsatilishi shart."
  });

  // 5. Topic relevance check
  const hasAgroOrEcon = /qishloq|dehqon|hosil|iqtisod|agro|moliyaviy|yer|oziq-ovqat|barqaror|suv|traktor|chorva|tuproq|texnika/i.test(text);
  if (!hasAgroOrEcon) score -= 10;
  requirementChecks.push({
    name: "Sohaga moslik (Agroiqtisodiyot)",
    passed: hasAgroOrEcon,
    details: hasAgroOrEcon
      ? "Maqola mavzusi qishloq xo'jaligi yoki iqtisodiyot sohasiga mos keladi."
      : "Mavzu qishloq xo'jaligi yoki iqtisodiyot sohasiga oidligi shubhali. Nashr faqat sohaviy ilmiy ishlarni qabul qiladi."
  });

  // 6. Spelling Errors check
  const spellingErrors: SpellingError[] = [];
  const commonTypos = [
    { typo: "teshkirish", correct: "tekshirish" },
    { typo: "hatolik", correct: "xatolik" },
    { typo: "hatolar", correct: "xatolar" },
    { typo: "hato", correct: "xato" },
    { typo: "xarakat", correct: "harakat" },
    { typo: "xam ", correct: "ham " },
    { typo: "xamma", correct: "hamma" },
    { typo: "xozir", correct: "hozir" },
    { typo: "hursand", correct: "xursand" },
    { typo: "taxlil", correct: "tahlil" },
    { typo: "maxsulot", correct: "mahsulot" },
    { typo: "hujalik", correct: "xo'jalik" },
    { typo: "xojalik", correct: "xo'jalik" },
    { typo: "uqituvchi", correct: "o'qituvchi" },
    { typo: "tushurish", correct: "tushirish" },
    { typo: "ruyxat", correct: "ro'yxat" },
    { typo: "buyicha", correct: "bo'yicha" },
    { typo: "tugri", correct: "to'g'ri" },
    { typo: "kup", correct: "ko'p" },
    { typo: "uzbek", correct: "o'zbek" },
    { typo: "bulim", correct: "bo'lim" },
    { typo: "suxbat", correct: "suhbat" },
    { typo: "raxbar", correct: "rahbar" },
    { typo: "raxmat", correct: "rahmat" },
    { typo: "xujjat", correct: "hujjat" },
    { typo: "habar", correct: "xabar" },
    { typo: "hizmat", correct: "xizmat" },
    { typo: "xaqiqat", correct: "haqiqat" },
    { typo: "xuquq", correct: "huquq" },
    { typo: "xurmat", correct: "hurmat" }
  ];

  const lowerText = text.toLowerCase();
  
  // Find typos in the text
  commonTypos.forEach(({ typo, correct }) => {
    const idx = lowerText.indexOf(typo.trim());
    if (idx !== -1) {
      score -= 3;
      // Get context around the typo
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + typo.trim().length + 30);
      let context = text.substring(start, end).replace(/\n/g, " ");
      if (start > 0) context = "..." + context;
      if (end < text.length) context = context + "...";

      spellingErrors.push({
        word: text.substring(idx, idx + typo.trim().length),
        suggestion: correct.trim(),
        context: context
      });
    }
  });

  // Calculate final score
  score = Math.max(30, Math.min(100, score));

  // Generate suggestions
  const suggestions: string[] = [];
  if (!wordCountPassed) {
    suggestions.push("Maqolaning hajmini oshiring. Mavzuni chuqurroq yoritish uchun qo'shimcha tahlillar va statistik ma'lumotlar qo'shing.");
  }
  if (!hasAnnotation) {
    suggestions.push("Maqolaning boshiga o'zbek, rus va ingliz tillarida qisqacha annotatsiya (150-250 so'z) kiriting.");
  }
  if (!hasKeywords) {
    suggestions.push("Annotatsiyadan so'ng maqola mazmunini ifodalovchi 5-8 ta kalit so'z yoki iboralarni (uch tilda) qo'shing.");
  }
  if (!hasReferences) {
    suggestions.push("Maqolaning oxiriga foydalanilgan adabiyotlar ro'yxatini (kamida 10 ta manba, APA formatida) ilova qiling.");
  }
  if (!hasAgroOrEcon) {
    suggestions.push("Maqola mazmunini qishloq xo'jaligi iqtisodiyoti, agro-innovatsiyalar yoki oziq-ovqat xavfsizligi masalalariga ko'proq bog'lang.");
  }
  if (spellingErrors.length > 0) {
    suggestions.push(`Matnda aniqlangan imlo xatolarini (${spellingErrors.length} ta) to'g'rilang.`);
  }
  if (score >= 85 && suggestions.length === 0) {
    suggestions.push("Maqola barcha asosiy talablarga javob beradi. Uni rasmiy ravishda tahririyatga yuborishingiz mumkin.");
  }

  // Generate summary
  let summary = "";
  if (score >= 85) {
    summary = "Maqola juda yaxshi tayyorlangan. Jurnal talablariga deyarli to'liq mos keladi va ilmiy talablar darajasida yozilgan.";
  } else if (score >= 65) {
    summary = "Maqola qoniqarli darajada yozilgan, ammo unda jurnal talablariga mos kelmaydigan ba'zi kamchiliklar va imlo xatolari aniqlandi. Ularni tuzatish tavsiya etiladi.";
  } else {
    summary = "Maqola sifati past yoki jurnal talablariga mos kelmaydi. Hajmi yetarli emasligi yoki zaruriy qismlarning yo'qligi sababli tahririyat tomonidan rad etilishi mumkin. Iltimos, tavsiyalarga amal qiling.";
  }

  return {
    overallScore: score,
    spellingErrors,
    grammarIssues: spellingErrors.length > 3 ? ["Matnda tinish belgilari va imlo qoidalariga rioya etilmagan gaplar mavjud."] : [],
    requirementChecks,
    suggestions,
    summary
  };
}

/**
 * Matnni Gemini API orqali tekshirish
 */
export async function checkArticle(text: string): Promise<ArticleCheckResult> {
  if (!text || text.trim().length < 50) {
    throw new Error('Matn juda qisqa. Kamida 50 ta belgi kiritilishi kerak.');
  }

  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key is not configured. Falling back to local text analysis.');
    return localCheckArticle(text);
  }

  const prompt = `Sen o'zbek tilida ilmiy maqolalarni tekshiruvchi mutaxassissan. Quyidagi matnni tahlil qil va natijani FAQAT JSON formatda qaytar. Hech qanday qo'shimcha matn yozma, faqat JSON.

Matn:
"""
${text.substring(0, 15000)}
"""

Quyidagi mezonlar bo'yicha tekshir:

1. **Imlo xatolari**: O'zbek tilidagi imlo xatolarini top. Har bir xato uchun noto'g'ri so'z, to'g'ri variant va kontekst (xato atrofidagi gap) ko'rsat.

2. **Grammatik muammolar**: Grammatik xatolar, tinish belgilari, gap tuzilishi muammolarini aniqla.

3. **Jurnal talablariga moslik** ("AGROIQTISODIYOT" jurnali):
   - Matn kamida 8 betga yetarlimi (taxminan 3000+ so'z)?
   - Annotatsiya bormi (kirish qismi)?
   - Kalit so'zlar bormi?
   - Adabiyotlar ro'yxati / havolalar bormi?
   - Ilmiy uslubda yozilganmi?
   - Mavzu qishloq xo'jaligi / iqtisodiyot bilan bog'liqmi?

4. **Umumiy ball**: 0 dan 100 gacha umumiy sifat bali.

5. **Tavsiyalar**: Matnni yaxshilash bo'yicha 3-5 ta aniq tavsiya.

6. **Xulosa**: 2-3 gaplik umumiy baho.

JSON formati:
{
  "overallScore": <number 0-100>,
  "spellingErrors": [
    {"word": "<xato so'z>", "suggestion": "<to'g'ri variant>", "context": "<gap konteksti>"}
  ],
  "grammarIssues": ["<muammo tavsifi>"],
  "requirementChecks": [
    {"name": "<talab nomi>", "passed": <true/false>, "details": "<tafsilot>"}
  ],
  "suggestions": ["<tavsiya>"],
  "summary": "<umumiy xulosa>"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`AI xizmati xatosi: ${response.status}`);
    }

    const data = await response.json();

    // Extract the text from Gemini response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('AI javob qaytarmadi. Qaytadan urinib ko\'ring.');
    }

    // Parse JSON from response
    const result: ArticleCheckResult = JSON.parse(responseText);

    // Validate and provide defaults
    return {
      overallScore: Math.min(100, Math.max(0, result.overallScore || 0)),
      spellingErrors: Array.isArray(result.spellingErrors) ? result.spellingErrors : [],
      grammarIssues: Array.isArray(result.grammarIssues) ? result.grammarIssues : [],
      requirementChecks: Array.isArray(result.requirementChecks) ? result.requirementChecks : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      summary: result.summary || 'Natijalar mavjud emas.',
    };
  } catch (error) {
    console.warn('Gemini API failed, falling back to local analysis:', error);
    return localCheckArticle(text);
  }
}

async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).mammoth) {
      resolve();
      return;
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      // Script is already loading/loaded, wait a bit or assume it is ready
      setTimeout(resolve, 500);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Kutubxonani yuklashda xatolik yuz berdi.'));
    document.head.appendChild(script);
  });
}

async function extractDocxText(file: File): Promise<string> {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js');
    const arrayBuffer = await file.arrayBuffer();
    const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err: any) {
    throw new Error('Word (.docx) faylini o\'qishda xatolik: ' + err.message);
  }
}

/**
 * Fayldan matn ajratib olish
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'pdf') {
    return await extractPDFText(file);
  }

  if (extension === 'docx') {
    return await extractDocxText(file);
  }

  if (extension === 'doc') {
    throw new Error(
      'Eski Word (.doc) formati qo\'llab-quvvatlanmaydi. ' +
      'Iltimos, faylni Word dasturida ".docx" formatida saqlab, keyin yuklang yoki matnni nusxalab joylashtiring.'
    );
  }

  throw new Error(`"${extension}" formati qo'llab-quvvatlanmaydi. .docx, .pdf yoki .txt fayllarni yuklang.`);
}

async function extractPDFText(file: File): Promise<string> {
  // Dynamic import of PDF.js from CDN
  const pdfjsLib = await import(/* @vite-ignore */ 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');

  // Set worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
}

/**
 * Ball rangini aniqlash
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'A\'lo';
  if (score >= 80) return 'Yaxshi';
  if (score >= 60) return 'Qoniqarli';
  if (score >= 40) return 'O\'rtacha';
  return 'Yomon';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/10 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/30';
  return 'bg-red-500/10 border-red-500/30';
}
