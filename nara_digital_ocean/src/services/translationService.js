import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 🌐 NARA TRANSLATION SERVICE
 * Auto-translates research papers to Sinhala & Tamil
 * Uses Gemini API with Google Translate fallback
 */

// Initialize Gemini AI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBTn4EEzPG4G7YF_w_example'; // Add your key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Translation cache to avoid re-translating
const translationCache = new Map();

/**
 * Translate text using Gemini AI
 */
export const translateWithGemini = async (text, targetLanguage) => {
  const cacheKey = `${text.substring(0, 50)}_${targetLanguage}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    console.log('📦 Using cached translation');
    return translationCache.get(cacheKey);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const languageMap = {
      si: 'Sinhala (සිංහල)',
      ta: 'Tamil (தமிழ்)',
      en: 'English'
    };

    const prompt = `Translate the following text to ${languageMap[targetLanguage]}.
    
IMPORTANT RULES:
- Preserve all scientific terms accurately
- Maintain professional academic tone
- Keep numbers, units, and technical terms in English if no direct translation exists
- For marine biology terms, use commonly accepted ${languageMap[targetLanguage]} equivalents
- Format the translation naturally for ${languageMap[targetLanguage]} readers

TEXT TO TRANSLATE:
${text}

TRANSLATION:`;

    const result = await model.generateContent(prompt);
    const translation = result.response.text();
    
    // Cache the result
    translationCache.set(cacheKey, translation);
    
    console.log(`✅ Gemini translation to ${targetLanguage} successful`);
    return translation;
    
  } catch (error) {
    console.error('❌ Gemini translation failed:', error);
    
    // Fallback to Google Translate
    return await translateWithGoogle(text, targetLanguage);
  }
};

/**
 * Fallback: Google Translate API (Free tier)
 */
export const translateWithGoogle = async (text, targetLanguage) => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract translation from response
    const translation = data[0].map(item => item[0]).join('');
    
    console.log(`✅ Google Translate to ${targetLanguage} successful (fallback)`);
    return translation;
    
  } catch (error) {
    console.error('❌ Google Translate failed:', error);
    return text; // Return original if all fails
  }
};

/**
 * Translate entire research paper document
 */
export const translateResearchPaper = async (paper, targetLanguage) => {
  console.log(`🌐 Translating paper to ${targetLanguage}...`);
  
  try {
    // Translate title
    const translatedTitle = await translateWithGemini(
      paper.title.en || paper.title,
      targetLanguage
    );
    
    // Translate description/abstract
    const translatedDescription = await translateWithGemini(
      paper.description.en || paper.description,
      targetLanguage
    );
    
    // Translate tags
    const translatedTags = await Promise.all(
      (paper.tags || []).map(tag => translateWithGemini(tag, targetLanguage))
    );
    
    // Translate category
    const translatedCategory = await translateWithGemini(
      paper.category,
      targetLanguage
    );
    
    return {
      ...paper,
      title: {
        ...paper.title,
        [targetLanguage]: translatedTitle
      },
      description: {
        ...paper.description,
        [targetLanguage]: translatedDescription
      },
      tags: translatedTags,
      category: translatedCategory,
      translatedLanguage: targetLanguage,
      translationDate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Paper translation failed:', error);
    throw error;
  }
};

/**
 * Extract text from PDF for translation
 */
export const extractTextFromPDF = async (pdfUrl) => {
  try {
    // TEMPORARILY DISABLED - PDF extraction not needed for podcasts
    return '';
    /*
    // Use PDF.js to extract text
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // First 10 pages
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    console.log(`📄 Extracted ${fullText.length} characters from PDF`);
    return fullText;
    */
  } catch (error) {
    console.error('❌ PDF text extraction failed:', error);
    return '';
  }
};

/**
 * Batch translate multiple papers
 */
export const batchTranslatePapers = async (papers, targetLanguages = ['si', 'ta']) => {
  const results = [];
  
  for (const paper of papers) {
    for (const lang of targetLanguages) {
      try {
        const translated = await translateResearchPaper(paper, lang);
        results.push(translated);
        
        // Add delay to avoid rate limits (Gemini free tier)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Failed to translate ${paper.title} to ${lang}`);
      }
    }
  }
  
  return results;
};

/**
 * Check translation quality
 */
export const checkTranslationQuality = (original, translated, language) => {
  // Basic quality checks
  const quality = {
    score: 0,
    issues: []
  };
  
  // Length check (translation shouldn't be drastically different)
  const lengthRatio = translated.length / original.length;
  if (lengthRatio < 0.5 || lengthRatio > 2) {
    quality.issues.push('Length difference too large');
  } else {
    quality.score += 30;
  }
  
  // Check if contains target language script
  const scriptChecks = {
    si: /[\u0D80-\u0DFF]/, // Sinhala unicode range
    ta: /[\u0B80-\u0BFF]/  // Tamil unicode range
  };
  
  if (scriptChecks[language] && scriptChecks[language].test(translated)) {
    quality.score += 50;
  } else {
    quality.issues.push('Target language script not detected');
  }
  
  // Check if translation is not just the original
  if (translated === original) {
    quality.issues.push('Translation identical to original');
  } else {
    quality.score += 20;
  }
  
  return quality;
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
  translationCache.clear();
  console.log('🗑️  Translation cache cleared');
};

export default {
  translateWithGemini,
  translateWithGoogle,
  translateResearchPaper,
  extractTextFromPDF,
  batchTranslatePapers,
  checkTranslationQuality,
  getSupportedLanguages,
  clearTranslationCache
};
