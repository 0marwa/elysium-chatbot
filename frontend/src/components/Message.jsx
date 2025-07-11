import React from 'react';
import ReactMarkdown from 'react-markdown';
import './Message.css';

const Message = ({ message, isUser, timestamp, type = 'normal' }) => {
  const formatTime = (time) => {
    if (!time) return '';
    return new Date(time).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className={`message-bubble ${type}`}>
        <div className="message-content">
          {isUser ? (
            message
          ) : (
            <ReactMarkdown>{message}</ReactMarkdown>
          )}
        </div>
        {timestamp && (
          <div className="message-timestamp">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
      {!isUser && (
        <div className="bot-avatar">
          <span className="bot-icon">🕌</span>
        </div>
      )}
    </div>
  );
};

export default Message;