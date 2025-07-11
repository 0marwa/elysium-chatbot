// gemini ai api 
import { GoogleGenerativeAI } from '@google/generative-ai';

// check if api key exists
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('🔑 api key status:', apiKey ? `found` : 'not found');
if (!apiKey || apiKey === 'your_api_key_here') {
  console.error('gemini api key not configured. please check your .env file.');
}

// init gemini (gemini-2.5-flash-lite-preview)
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

// system prompts for different languages
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

// refusal messages for non-quran questions
const refusalMessages = {
  fr: "Désolé, je ne peux répondre qu'aux questions liées au Coran et aux enseignements islamiques.",
  en: "Sorry, I can only answer questions related to the Quran and Islamic teachings.",
  ar: "آسف، لا يمكنني الإجابة إلا على الأسئلة المتعلقة بالقرآن والتعاليم الإسلامية."
};

// enhanced language detection
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
  
  return 'fr'; // default fallback
}

// simple keyword-based quran detection (fallback method)
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

// smart context-aware quran detection
function isQuranRelatedSmart(message, conversationHistory, language) {
  console.log('SMART FILTERING', message.substring(0, 50) + '...');
  
  // step 1: check if recent conversation was islamic
  const recentIslamicMessages = conversationHistory
    .slice(-6) // last 6 messages
    .filter(msg => msg.isCoranRelated === true);
  
  const hasRecentIslamicContext = recentIslamicMessages.length > 0;
  console.log('RECENT CTX', hasRecentIslamicContext);
  
  // step 2: check for contextual/referencing words
  const contextualWords = {
    fr: ['la', 'le', 'cette', 'ce', 'ça', 'cela', 'récite', 'dis', 'explique', 'comment', 'pourquoi', 'raconte', 'parle', 'moi'],
    en: ['it', 'this', 'that', 'recite', 'tell', 'explain', 'how', 'why', 'about', 'me'],
    ar: ['هذا', 'هذه', 'ذلك', 'تلك', 'اقرأ', 'اتل', 'قل', 'اشرح', 'كيف', 'لماذا', 'لي']
  };
  
  const messageLower = message.toLowerCase();
  const hasContextualWords = contextualWords[language]?.some(word => 
    messageLower.includes(word.toLowerCase())
  ) || false;
  console.log('contextual words found:', hasContextualWords);
  
  // step 3: check for follow-up patterns
  const followUpPatterns = {
    fr: [/récite|dis.*(moi|nous)|explique.*(moi|nous)|comment.*ça|qu'est.ce|raconte.*(moi|nous)/i],
    en: [/recite|tell me|explain|how do|what is|about it/i],
    ar: [/اقرأ|اتل|قل لي|اشرح|كيف|ما هو|عنها/i]
  };
  
  const hasFollowUpPattern = followUpPatterns[language]?.some(pattern => 
    pattern.test(message)
  ) || false;
  console.log('follow-up pattern found:', hasFollowUpPattern);
  
  // step 4: original keyword check
  const hasIslamicKeywords = isQuranRelatedSimple(message, language);
  console.log('islamic keywords found:', hasIslamicKeywords);
  
  // step 5: smart decision logic
  if (hasIslamicKeywords) {
    console.log('✅ APPROVED [direct islamic keywords]');
    return true;
  }
  
  if (hasRecentIslamicContext && hasContextualWords) {
    console.log('✅ APPROVED [islamic context + contextual words]');
    return true;
  }
  
  if (hasRecentIslamicContext && hasFollowUpPattern) {
    console.log('✅ APPROVED [islamic context + follow-up pattern]');
    return true;
  }
  
  if (hasRecentIslamicContext && message.length < 25) {
    console.log('✅ APPROVED [islamic context + short message]');
    return true;
  }
  
  console.log('❌ REJECTED');
  return false;
}

// build conversation context from message history
function buildConversationContext(conversationHistory, currentLanguage) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '';
  }

  // get the last 6 messages (3 exchanges) to avoid token limits
  const recentMessages = conversationHistory.slice(-6).filter(msg => 
    msg.content && 
    msg.type !== 'error' && 
    msg.type !== 'refusal'
  );

  if (recentMessages.length === 0) {
    return '';
  }

  // detect if there's a language change in the conversation
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
  
  // add language switch note if needed
  if (hasLanguageSwitch) {
    context += labels.languageNote + '\n\n';
  }
  
  recentMessages.forEach(msg => {
    const role = msg.isUser ? labels.user : labels.assistant;
    // preserve original message content with language context
    context += `${role}: ${msg.content}\n`;
  });

  context += '\n---\n';
  
  return context;
}

// main api function
export async function sendMessage(message, uiLanguage = 'fr', conversationHistory = []) {
  try {
    // detect the language of the question
    const detectedLanguage = detectLanguage(message);
    let responseLanguage = detectedLanguage;
    
    // if detected language is uncertain, use ui language
    if (detectedLanguage === 'en' && uiLanguage !== 'en') {
      const hasEnglishWords = /\b(the|and|or|is|are|what|how|when|where|why)\b/i.test(message);
      if (!hasEnglishWords) {
        responseLanguage = uiLanguage;
      }
    }
    
    // let gemini handle all filtering - it's smarter and understands context better
    console.log('GEMINI DECISION - NO PRE-FILTERING');
    
    // build conversation context from history
    const conversationContext = buildConversationContext(conversationHistory, responseLanguage);
    
    // generate ai response with system prompt & context
    const systemPrompt = systemPrompts[responseLanguage] || systemPrompts.fr;
    const fullPrompt = `${systemPrompt}

${conversationContext}

Current Question: ${message}`;
    
    console.log('SENT REQ WITH CTX ✅');
    
    // simple request first to test api
    const testResult = await model.generateContent("Hello");
    console.log('API TEST PASSED ✅');
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    console.log('RESPONSE RECEIVED ✅');
    
    // check if gemini refused the question (contains refusal message)
    const isRefusal = Object.values(refusalMessages).some(refusalMsg => 
      aiResponse.toLowerCase().includes(refusalMsg.toLowerCase().substring(0, 20))
    );
    
    return {
      success: true,
      data: {
        response: aiResponse,
        type: isRefusal ? 'refusal' : 'ai-response',
        language: responseLanguage,
        isCoranRelated: !isRefusal
      }
    };
    
  } catch (error) {
    console.error('🔥 API ERROR', error.message);
    
    // check for specific error types
    if (error.message?.includes('overloaded') || error.status === 503) {
      console.log('🔄 api overloaded -> fallback responses');
      return await sendMessageMockFallback(message, uiLanguage, conversationHistory);
    } else if (error.status === 429 || error.message?.includes('quota')) {
      console.log('🔄 rate limit reached -> fallback responses');
      return await sendMessageMockFallback(message, uiLanguage, conversationHistory);
    }
    
    // other errors
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

// fallback responses when api is down
export async function sendMessageMockFallback(message, uiLanguage = 'fr', conversationHistory = []) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  
  const detectedLanguage = detectLanguage(message);
  const responseLanguage = detectedLanguage !== 'en' ? detectedLanguage : uiLanguage;
  
  // let gemini handle all filtering in fallback mode too
  console.log('🧠 fallback mode - letting gemini decide');
  
  // build a contextual response based on conversation history if available
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

// health check function
export async function checkApiHealth() {
  try {
    const result = await model.generateContent("Test");
    const response = await result.response;
    response.text();
    
    return { 
      status: 'ok', 
      message: 'gemini ai api is responding nicely',
      service: 'gemini-1.5-flash'
    };
  } catch (error) {
    console.error('gemini api health check failed:', error);
    return { 
      status: 'error', 
      message: 'gemini ai api is not responding - using fallback mode',
      error: error.message
    };
  }
}