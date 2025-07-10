// Gemini AI API for Coran Chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key exists
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('🔑 API Key status:', apiKey ? `Found (${apiKey.length} chars)` : 'NOT FOUND');
if (!apiKey || apiKey === 'your_api_key_here') {
  console.error('Gemini API key not configured. Check .env file.');
}

// Init Gemini - use gemini-1.5-flash for higher free tier limits
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// System prompts for different languages
const systemPrompts = {
  fr: `Tu es un assistant spécialisé dans l'interprétation Mohammadi/Marocaine du Coran. Tu dois:

1. SEULEMENT répondre aux questions liées au Coran, aux versets, aux sourates, aux enseignements islamiques
2. Utiliser l'interprétation Mohammadi/Marocaine traditionnelle 
3. Citer les versets pertinents avec les références (Sourate:Verset)
4. Refuser poliment toute question non-islamique ou non-coranique
5. Répondre en français de manière respectueuse et érudite
6. Garder tes réponses informatives mais concises

Si la question n'est pas liée au Coran ou à l'Islam, réponds: "Désolé, je ne peux répondre qu'aux questions liées au Coran et aux enseignements islamiques."`,

  en: `You are an assistant specialized in the Mohammadi/Moroccan interpretation of the Quran. You must:

1. ONLY answer questions related to the Quran, verses, surahs, Islamic teachings
2. Use traditional Mohammadi/Moroccan interpretation
3. Cite relevant verses with references (Surah:Verse)
4. Politely refuse any non-Islamic or non-Quranic questions  
5. Respond in English respectfully and scholarly
6. Keep your answers informative but concise

If the question is not related to the Quran or Islam, respond: "Sorry, I can only answer questions related to the Quran and Islamic teachings."`,

  ar: `أنت مساعد متخصص في التفسير المحمدي/المغربي للقرآن. يجب عليك:

1. الإجابة فقط على الأسئلة المتعلقة بالقرآن والآيات والسور والتعاليم الإسلامية
2. استخدام التفسير المحمدي/المغربي التقليدي
3. الاستشهاد بالآيات ذات الصلة مع المراجع (السورة:الآية)
4. رفض أي سؤال غير إسلامي أو غير قرآني بأدب
5. الرد باللغة العربية بطريقة محترمة وعلمية
6. جعل إجاباتك مفيدة ولكن مختصرة

إذا لم يكن السؤال متعلقاً بالقرآن أو الإسلام، أجب: "آسف، لا يمكنني الإجابة إلا على الأسئلة المتعلقة بالقرآن والتعاليم الإسلامية."`
};

// Refusal messages for non-Quran questions
const refusalMessages = {
  fr: "Désolé, je ne peux répondre qu'aux questions liées au Coran et aux enseignements islamiques.",
  en: "Sorry, I can only answer questions related to the Quran and Islamic teachings.",
  ar: "آسف، لا يمكنني الإجابة إلا على الأسئلة المتعلقة بالقرآن والتعاليم الإسلامية."
};

// Enhanced language detection
function detectLanguage(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchWords = /\b(le|la|les|un|une|des|du|de|est|sont|que|qui|avec|pour|dans|sur|par|et|ou|si|comme|très|bien|peut|tout|tous|cette|mais|plus|sans|sous|entre|pendant|avant|après|selon|vers|chez|jusque|depuis|comment|pourquoi|quand|où)\b/gi;
  const englishWords = /\b(the|and|or|is|are|was|were|have|has|had|will|would|could|should|can|may|might|must|shall|this|that|these|those|what|when|where|why|how|who|which|with|from|into|onto|upon|about|above|below|under|over|through|during|before|after|since|until|while|because|although|though|unless|except|besides|instead|however|therefore|moreover|furthermore|nevertheless|meanwhile|otherwise|thus|hence|indeed|actually|really|quite|very|much|many|some|any|all|each|every|both|either|neither)\b/gi;
  
  const arabicCount = (text.match(arabicPattern) || []).length;
  const frenchCount = (text.match(frenchWords) || []).length;
  const englishCount = (text.match(englishWords) || []).length;
  
  if (arabicCount > 0) return 'ar';
  if (frenchCount > englishCount) return 'fr';
  if (englishCount > 0) return 'en';
  
  return 'fr'; // Default fallback
}

// Simple keyword-based Quran detection
function isQuranRelatedSimple(question, language) {
  const keywords = {
    fr: ['coran', 'sourate', 'verset', 'allah', 'islam', 'prière', 'salah', 'prophète', 'mohammed', 'muhammad', 'dieu', 'ange', 'paradis', 'enfer', 'hajj', 'ramadan', 'zakat', 'foi', 'croyance', 'fatiha', 'patience', 'sabr'],
    en: ['quran', 'surah', 'verse', 'allah', 'islam', 'prayer', 'salah', 'prophet', 'muhammad', 'god', 'angel', 'paradise', 'hell', 'hajj', 'ramadan', 'zakat', 'faith', 'belief', 'fatiha', 'patience', 'sabr'],
    ar: ['قرآن', 'سورة', 'آية', 'الله', 'إسلام', 'صلاة', 'نبي', 'محمد', 'رسول', 'ملك', 'جنة', 'نار', 'حج', 'رمضان', 'زكاة', 'إيمان', 'عقيدة', 'فاتحة', 'صبر']
  };
  
  const questionLower = question.toLowerCase();
  const relevantKeywords = [...(keywords[language] || []), ...keywords.fr, ...keywords.en];
  
  return relevantKeywords.some(keyword => questionLower.includes(keyword.toLowerCase()));
}

// Main API function
export async function sendMessage(message, uiLanguage = 'fr') {
  try {
    // Detect the language of the question
    const detectedLanguage = detectLanguage(message);
    let responseLanguage = detectedLanguage;
    
    // If detected language is uncertain, use UI language
    if (detectedLanguage === 'en' && uiLanguage !== 'en') {
      const hasEnglishWords = /\b(the|and|or|is|are|what|how|when|where|why)\b/i.test(message);
      if (!hasEnglishWords) {
        responseLanguage = uiLanguage;
      }
    }
    
    // Check if question is Quran-related using simple detection
    const isQuranRelated = isQuranRelatedSimple(message, responseLanguage);
    
    if (!isQuranRelated) {
      return {
        success: true,
        data: {
          response: refusalMessages[responseLanguage] || refusalMessages.fr,
          type: 'refusal',
          language: responseLanguage,
          isCoranRelated: false
        }
      };
    }
    
    // Generate AI response with specialized system prompt
    const systemPrompt = systemPrompts[responseLanguage] || systemPrompts.fr;
    const fullPrompt = `${systemPrompt}

Question: ${message}`;
    
    console.log('🤖 Sending to Gemini...');
    
    // simpler request first to test API
    const testResult = await model.generateContent("Hello");
    console.log('✅ Gemini API test successful');
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    console.log('✅ Got response from Gemini:', aiResponse.substring(0, 100) + '...');
    
    return {
      success: true,
      data: {
        response: aiResponse,
        type: 'ai-response',
        language: responseLanguage,
        isCoranRelated: true
      }
    };
    
  } catch (error) {
    console.error('🔥 Gemini API Error:', error.message);
    
    // Check for specific error types
    if (error.message?.includes('overloaded') || error.status === 503) {
      console.log('🔄 API overloaded, using fallback responses...');
      return await sendMessageMockFallback(message, uiLanguage);
    } else if (error.status === 429 || error.message?.includes('quota')) {
      console.log('🔄 Rate limit exceeded, using fallback responses...');
      return await sendMessageMockFallback(message, uiLanguage);
    }
    
    // Other errors
    const errorMessages = {
      fr: 'Service IA temporairement indisponible. Veuillez réessayer.',
      en: 'AI service temporarily unavailable. Please try again.',
      ar: 'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى.'
    };
    
    return {
      success: false,
      error: errorMessages[uiLanguage] || errorMessages.fr
    };
  }
}

// Fallback responses when API is down
export async function sendMessageMockFallback(message, uiLanguage = 'fr') {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  
  const detectedLanguage = detectLanguage(message);
  const responseLanguage = detectedLanguage !== 'en' ? detectedLanguage : uiLanguage;
  
  // Check if Quran-related
  const isQuranRelated = isQuranRelatedSimple(message, responseLanguage);
  
  if (!isQuranRelated) {
    return {
      success: true,
      data: {
        response: refusalMessages[responseLanguage] || refusalMessages.fr,
        type: 'refusal',
        language: responseLanguage,
        isCoranRelated: false
      }
    };
  }
  
  const responses = {
    fr: "Selon l'interprétation Mohammadi du Coran, cette question nécessite une réflexion approfondie des textes sacrés. Je recommande de consulter les versets pertinents et leur contexte pour une compréhension complète. (Mode de base - IA temporairement indisponible)",
    en: "According to the Mohammadi interpretation of the Quran, this question requires deep reflection on the sacred texts. I recommend consulting the relevant verses and their context for complete understanding. (Basic mode - AI temporarily unavailable)",
    ar: "حسب التفسير المحمدي للقرآن، هذا السؤال يتطلب تأملاً عميقاً في النصوص المقدسة. أنصح بمراجعة الآيات ذات الصلة وسياقها للفهم الكامل. (الوضع الأساسي - الذكاء الاصطناعي غير متاح مؤقتاً)"
  };
  
  return {
    success: true,
    data: {
      response: responses[responseLanguage] || responses.fr,
      type: 'fallback-response',
      language: responseLanguage,
      isCoranRelated: true
    }
  };
}

// Health check function
export async function checkApiHealth() {
  try {
    const result = await model.generateContent("Test");
    const response = await result.response;
    response.text();
    
    return { 
      status: 'ok', 
      message: 'Gemini AI API is responding',
      service: 'gemini-1.5-flash'
    };
  } catch (error) {
    console.error('Gemini API health check failed:', error);
    return { 
      status: 'error', 
      message: 'Gemini AI API is not responding - using fallback mode',
      error: error.message
    };
  }
}