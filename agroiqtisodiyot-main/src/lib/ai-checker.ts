/**
 * AI Article Checker — Gemini API integration
 * Maqolalarni jurnal talablariga mosligini va imlo xatolarini tekshirish
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
 * Matnni Gemini API orqali tekshirish
 */
export async function checkArticle(text: string): Promise<ArticleCheckResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API kaliti topilmadi. .env faylini tekshiring.');
  }

  if (!text || text.trim().length < 50) {
    throw new Error('Matn juda qisqa. Kamida 50 ta belgi kiritilishi kerak.');
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
    if (error instanceof SyntaxError) {
      throw new Error('AI natijalarini qayta ishlashda xatolik. Qaytadan urinib ko\'ring.');
    }
    throw error;
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
    // Use PDF.js to extract text from PDF
    // Since we can't import pdfjs easily in Vite without config,
    // we'll use a simple approach
    return await extractPDFText(file);
  }

  if (extension === 'doc' || extension === 'docx') {
    // For Word files, we'll try reading as text or ask user to paste
    throw new Error(
      'Word (.doc/.docx) fayllarni to\'g\'ridan-to\'g\'ri o\'qish imkoni yo\'q. ' +
      'Iltimos, matnni Word fayldan nusxalab, matn maydoniga qo\'ying.'
    );
  }

  throw new Error(`"${extension}" formati qo'llab-quvvatlanmaydi. .txt yoki .pdf fayllarni yuklang.`);
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
