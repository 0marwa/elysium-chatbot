import React, { useState } from 'react';
import './InputBar.css';

const translations = {
  fr: {
    placeholder: 'Posez votre question sur le Coran...',
    sendButton: 'Envoyer',
    sendIcon: '➤'
  },
  en: {
    placeholder: 'Ask your question about the Quran...',
    sendButton: 'Send',
    sendIcon: '➤'
  },
  ar: {
    placeholder: 'اسأل سؤالك عن القرآن...',
    sendButton: 'إرسال',
    sendIcon: '⬅'
  }
};

const InputBar = ({ onSendMessage, isLoading, language = 'fr' }) => {
  const [inputValue, setInputValue] = useState('');
  const t = translations[language] || translations.fr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="input-bar-container">
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            className={`message-input ${language === 'ar' ? 'rtl' : 'ltr'}`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            disabled={isLoading}
            rows={1}
            style={{
              direction: language === 'ar' ? 'rtl' : 'ltr',
              textAlign: language === 'ar' ? 'right' : 'left'
            }}
          />
          <button
            type="submit"
            className={`send-button ${!inputValue.trim() || isLoading ? 'disabled' : ''}`}
            disabled={!inputValue.trim() || isLoading}
            title={t.sendButton}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <span className="send-icon">{t.sendIcon}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBar;