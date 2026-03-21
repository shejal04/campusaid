import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm Campus Aid's AI Assistant. Ask me about notes, fees, admission, quizzes, or anything campus-related!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to backend API
      const response = await api.chatbot.sendMessage(inputValue);

      if (response.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.message,
          sender: 'bot',
          intent: response.data.intent,
          confidence: response.data.confidence,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I couldn't process your message. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting. Please check your connection.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Clear this conversation?')) {
      try {
        await api.chatbot.clearChat();
        setMessages([
          {
            id: 1,
            text: "Hello! 👋 I'm Campus Aid's AI Assistant. How can I help?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  return (
    <div style={{
      height: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f35 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: '0',
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              🤖 Campus AI Assistant
            </h1>
            <p style={{
              margin: '0.3rem 0 0 0',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem'
            }}>
              Powered by AI & NLP
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Clear Button */}
            <button
              onClick={handleClearChat}
              style={{
                padding: '0.7rem 1.2rem',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '1rem 1.5rem',
                borderRadius: msg.sender === 'user' ? '15px 0 15px 15px' : '0 15px 15px 15px',
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.text}
                {msg.intent && <div style={{
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  opacity: 0.7
                }}>Intent: {msg.intent} ({(msg.confidence * 100).toFixed(0)}%)</div>}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}>
                <span style={{ animation: 'bounce 1.4s infinite' }}>●</span>
                <span style={{ animation: 'bounce 1.4s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'bounce 1.4s infinite 0.4s' }}>●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about admission, fees, notes..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </form>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        input::placeholder { color: rgba(255, 255, 255, 0.6); }
      `}</style>
    </div>
  );
}
