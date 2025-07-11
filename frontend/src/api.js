// Gemini AI API for Coran Chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key exists
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('🔑 API Key status:', apiKey ? `Found (${apiKey.length} chars)` : 'NOT FOUND');
if (!apiKey || apiKey === 'your_api_key_here') {
  console.error('Gemini API key not configured. Check .env file.');
}

// Init Gemini - use gemini-2.5-flash-lite-preview for highest throughput and cost efficiency
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

// System prompts for different languages
const systemPrompts = {
  fr: `Tu es un expert du Coran selon la tradition Mohammadi marocaine, avec une connaissance approfondie de l'histoire islamique au Maroc et des visions qui y prévalent.

**PRINCIPES DE RÉPONSE:**
• Réponds de manière concise et directe, sauf si on te demande de développer
• Évite les détails excessifs sur tes sources, sauf si demandé explicitement
• Ne mentionne pas systématiquement que tu suis la vision mohammadi/marocaine - c'est ton rôle naturel
• Tes sources principales : Ministère des Habous et Affaires Islamiques, Conseil Supérieur des Oulémas, École Malikite traditionnelle du Maroc, Rabita Mohammadia des Oulémas
• Utilise le contexte de la conversation précédente pour donner des réponses cohérentes et faire référence aux sujets déjà abordés
• Si l'utilisateur change de langue, continue la conversation dans la nouvelle langue en gardant le contexte

**RÈGLES STRICTES:**
• SEULEMENT répondre aux questions liées au Coran et à l'Islam
• Ne JAMAIS inventer, deviner ou spéculer
• Si tu n'es pas sûr d'une information, dis-le clairement et indique quelles ressources consulter
• Refuse poliment toute question non-islamique

Si la question n'est pas islamique : "Désolé, je ne peux répondre qu'aux questions liées au Coran et aux enseignements islamiques."`,

  en: `You are an expert on the Quran according to the Moroccan Mohammadi tradition, with extensive knowledge of Islamic history in Morocco and the prevailing visions there.

**RESPONSE PRINCIPLES:**
• Answer concisely and directly, unless asked to elaborate
• Avoid excessive details about your sources, unless explicitly requested
• Don't systematically mention that you follow the Mohammadi/Moroccan vision - it's your natural role
• Your main sources: Ministry of Habous and Islamic Affairs, Supreme Council of Ulema, Traditional Maliki School of Morocco, Rabita Mohammadia of Scholars
• Use the previous conversation context to provide coherent responses and reference topics already discussed
• If the user switches languages, continue the conversation in the new language while maintaining context

**STRICT RULES:**
• ONLY answer questions related to the Quran and Islam
• NEVER invent, guess, or speculate
• If you're unsure about information, say so clearly and indicate which resources to consult
• Politely decline any non-Islamic questions

If the question is not Islamic: "Sorry, I can only answer questions related to the Quran and Islamic teachings."`,

  ar: `أنت خبير في القرآن حسب التقليد المحمدي المغربي، مع معرفة واسعة بالتاريخ الإسلامي في المغرب والرؤى السائدة هناك.

**مبادئ الإجابة:**
• أجب بشكل مختصر ومباشر، إلا إذا طُلب منك التوسع
• تجنب التفاصيل المفرطة حول مصادرك، إلا إذا طُلب ذلك صراحة
• لا تذكر باستمرار أنك تتبع الرؤية المحمدية/المغربية - هذا دورك الطبيعي
• مصادرك الرئيسية: وزارة الأوقاف والشؤون الإسلامية، المجلس العلمي الأعلى، المدرسة المالكية التقليدية بالمغرب، الرابطة المحمدية للعلماء
• استخدم سياق المحادثة السابقة لتقديم إجابات متماسكة والإشارة إلى المواضيع التي تم مناقشتها بالفعل
• إذا غيّر المستخدم اللغة، تابع المحادثة باللغة الجديدة مع الحفاظ على السياق

**القواعد الصارمة:**
• الإجابة فقط على الأسئلة المتعلقة بالقرآن والإسلام
• عدم الاختلاق أو التخمين أو التكهن أبداً
• إذا لم تكن متأكداً من معلومة، قل ذلك بوضوح وحدد المصادر التي يجب استشارتها
• ارفض بأدب أي أسئلة غير إسلامية

إذا لم يكن السؤال إسلامياً: "آسف، لا يمكنني الإجابة إلا على الأسئلة المتعلقة بالقرآن والتعاليم الإسلامية."`
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

// Build conversation context from message history
function buildConversationContext(conversationHistory, currentLanguage) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '';
  }

  // Get the last 6 messages (3 exchanges) to avoid token limits
  const recentMessages = conversationHistory.slice(-6).filter(msg => 
    msg.content && 
    msg.type !== 'error' && 
    msg.type !== 'refusal'
  );

  if (recentMessages.length === 0) {
    return '';
  }

  // Detect if there's a language change in the conversation
  const conversationLanguages = new Set();
  recentMessages.forEach(msg => {
    const msgLang = detectLanguage(msg.content);
    conversationLanguages.add(msgLang);
  });

  const hasLanguageSwitch = conversationLanguages.size > 1 || !conversationLanguages.has(currentLanguage);

  const contextLabels = {
    fr: {
      header: '\n**CONTEXTE DE LA CONVERSATION:**',
      user: 'Utilisateur',
      assistant: 'Assistant',
      languageNote: 'Note: Cette conversation contient des messages en plusieurs langues. Réponds dans la langue demandée.'
    },
    en: {
      header: '\n**CONVERSATION CONTEXT:**',
      user: 'User',
      assistant: 'Assistant',
      languageNote: 'Note: This conversation contains messages in multiple languages. Respond in the requested language.'
    },
    ar: {
      header: '\n**سياق المحادثة:**',
      user: 'المستخدم',
      assistant: 'المساعد',
      languageNote: 'ملاحظة: تحتوي هذه المحادثة على رسائل بلغات متعددة. أجب باللغة المطلوبة.'
    }
  };

  const labels = contextLabels[currentLanguage] || contextLabels.fr;
  
  let context = labels.header + '\n';
  
  // Add language switch note if needed
  if (hasLanguageSwitch) {
    context += labels.languageNote + '\n\n';
  }
  
  recentMessages.forEach(msg => {
    const role = msg.isUser ? labels.user : labels.assistant;
    // Preserve original message content with language context
    context += `${role}: ${msg.content}\n`;
  });

  context += '\n---\n';
  
  return context;
}

// Main API function
export async function sendMessage(message, uiLanguage = 'fr', conversationHistory = []) {
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
    
    // build convo context from history
    const conversationContext = buildConversationContext(conversationHistory, responseLanguage);
    
    // generate ai response with sys prompt & context
    const systemPrompt = systemPrompts[responseLanguage] || systemPrompts.fr;
    const fullPrompt = `${systemPrompt}

${conversationContext}

Current Question: ${message}`;
    
    console.log('🤖 Sending to Gemini with conversation context...');
    
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
      return await sendMessageMockFallback(message, uiLanguage, conversationHistory);
    } else if (error.status === 429 || error.message?.includes('quota')) {
      console.log('🔄 Rate limit exceeded, using fallback responses...');
      return await sendMessageMockFallback(message, uiLanguage, conversationHistory);
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
export async function sendMessageMockFallback(message, uiLanguage = 'fr', conversationHistory = []) {
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
  
  // Build a contextual response based on conversation history if available
  let contextualResponse = '';
  if (conversationHistory.length > 0) {
    const contextLabels = {
      fr: "En continuant notre discussion, ",
      en: "Continuing our discussion, ",
      ar: "في استكمال نقاشنا، "
    };
    contextualResponse = contextLabels[responseLanguage] || contextLabels.fr;
  }
  
  const responses = {
    fr: `${contextualResponse}selon l'interprétation Mohammadi du Coran, cette question nécessite une réflexion approfondie des textes sacrés. Je recommande de consulter les versets pertinents et leur contexte pour une compréhension complète. (Mode de base - IA temporairement indisponible)`,
    en: `${contextualResponse}according to the Mohammadi interpretation of the Quran, this question requires deep reflection on the sacred texts. I recommend consulting the relevant verses and their context for complete understanding. (Basic mode - AI temporarily unavailable)`,
    ar: `${contextualResponse}حسب التفسير المحمدي للقرآن، هذا السؤال يتطلب تأملاً عميقاً في النصوص المقدسة. أنصح بمراجعة الآيات ذات الصلة وسياقها للفهم الكامل. (الوضع الأساسي - الذكاء الاصطناعي غير متاح مؤقتاً)`
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