import { useState } from 'react';
import ChatBox from './components/ChatBox';
import InputBar from './components/InputBar';
import { sendMessage } from './api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('fr');

  // Function to handle sending a message
  const handleSendMessage = async (content) => {
    const userMessage = {
      content: content,
      isUser: true,
      timestamp: new Date(),
      type: 'normal'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the API with conversation history
      const result = await sendMessage(content, language, messages);
      
      if (result.success) {
        const botMessage = {
          content: result.data.response,
          isUser: false,
          timestamp: new Date(),
          type: result.data.type || 'normal'
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Handle API error
        const errorMessage = {
          content: result.error || "Une erreur est survenue. Veuillez réessayer.",
          isUser: false,
          timestamp: new Date(),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        content: "Une erreur de connexion est survenue. Veuillez réessayer.",
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Function to clear conversation history
  const handleClearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <ChatBox 
          messages={messages} 
          isLoading={isLoading} 
          language={language}
          onLanguageChange={handleLanguageChange}
          onSuggestionClick={handleSendMessage}
          onClearConversation={handleClearConversation}
        />
        <InputBar 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          language={language}
        />
      </div>
    </div>
  );
}

export default App;