import React, { useState, useRef, useEffect } from 'react';
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
  const inputRef = useRef(null);
  const t = translations[language] || translations.fr;

  // auto-focus on mount and detect global typing
  useEffect(() => {
    // auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // global keydown listener to detect typing from anywhere
    const handleGlobalKeyDown = (e) => {
      // skip if input is already focused
      if (document.activeElement === inputRef.current) {
        return;
      }

      // skip special keys, shortcuts, and non-printable characters
      if (
        e.ctrlKey || 
        e.metaKey || 
        e.altKey || 
        e.key === 'Tab' || 
        e.key === 'Escape' || 
        e.key === 'Enter' || 
        e.key.startsWith('Arrow') || 
        e.key.startsWith('F') || 
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key.length > 1 // skip other special keys
      ) {
        return;
      }

      // focus input and let the character be typed naturally
      if (inputRef.current && e.key.length === 1) {
        inputRef.current.focus();
      }
    };

    // add global listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    // cleanup
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

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
            ref={inputRef}
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