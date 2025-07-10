import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './ChatBox.css';

const translations = {
  fr: {
    title: 'Assistant Coranique',
    subtitle: 'Assistant Coranique - Interprétation Mohammadi',
    welcome: 'Bienvenue dans l\'Assistant Coranique',
    description: 'Je peux vous aider avec des questions sur le Saint Coran basées sur l\'interprétation Mohammadi marocaine. N\'hésitez pas à poser des questions sur les versets, les sourates ou les enseignements islamiques.',
    examplesTitle: 'Exemples de questions :',
    examples: [
      '"Que dit le Coran sur la patience ?"',
      '"Parlez-moi de la Sourate Al-Fatiha"',
      '"Quelle est la signification du verset 2:255 ?"'
    ],
    loading: 'Veuillez patienter...'
  },
  en: {
    title: 'Quranic Assistant',
    subtitle: 'Quranic Assistant - Mohammadi Interpretation',
    welcome: 'Welcome to the Quranic Assistant',
    description: 'I can help you with questions about the Holy Quran based on the Moroccan Mohammadi interpretation. Feel free to ask about verses, surahs, or Islamic teachings.',
    examplesTitle: 'Example questions:',
    examples: [
      '"What does the Quran say about patience?"',
      '"Tell me about Surah Al-Fatiha"',
      '"What is the meaning of verse 2:255?"'
    ],
    loading: 'Please wait...'
  },
  ar: {
    title: 'مساعد القرآن الكريم',
    subtitle: 'مساعد القرآن الكريم - التفسير المحمدي',
    welcome: 'مرحباً بك في مساعد القرآن الكريم',
    description: 'يمكنني مساعدتك في الأسئلة المتعلقة بالقرآن الكريم بناءً على التفسير المحمدي المغربي. لا تتردد في السؤال عن الآيات والسور أو التعاليم الإسلامية.',
    examplesTitle: 'أمثلة على الأسئلة:',
    examples: [
      '"ماذا يقول القرآن عن الصبر؟"',
      '"أخبرني عن سورة الفاتحة"',
      '"ما معنى الآية 2:255؟"'
    ],
    loading: 'الرجاء الانتظار...'
  }
};

const ChatBox = ({ messages, isLoading, language, onLanguageChange, onSuggestionClick }) => {
  const messagesEndRef = useRef(null);
  const t = translations[language] || translations.fr;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderWelcomeMessage = () => (
    <div className="welcome-container">
      <div className="welcome-icon">🕌</div>
      <h2 className="welcome-title" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        {t.welcome}
      </h2>
      <p className="welcome-description">
        {t.description}
      </p>
      <div className="welcome-examples">
        <p className="examples-title">{t.examplesTitle}</p>
        <ul>
          {t.examples.map((example, index) => (
            <li 
              key={index} 
              className="suggestion-item"
              onClick={() => onSuggestionClick && onSuggestionClick(example.replace(/['"]/g, ''))}
            >
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderLoadingIndicator = () => (
    <div className="loading-container">
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="loading-text" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        {t.loading}
      </p>
    </div>
  );

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="header-content">
          <div className="header-icon">🕌</div>
          <div className="header-text">
            <h1 style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="language-switcher">
          <button 
            className={`language-btn ${language === 'fr' ? 'active' : ''}`}
            onClick={() => onLanguageChange('fr')}
          >
            FR
          </button>
          <button 
            className={`language-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => onLanguageChange('en')}
          >
            EN
          </button>
          <button 
            className={`language-btn ${language === 'ar' ? 'active' : ''}`}
            onClick={() => onLanguageChange('ar')}
          >
            AR
          </button>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          renderWelcomeMessage()
        ) : (
          messages.map((msg, index) => (
            <Message
              key={index}
              message={msg.content}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              type={msg.type || 'normal'}
            />
          ))
        )}
        
        {isLoading && renderLoadingIndicator()}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatBox;