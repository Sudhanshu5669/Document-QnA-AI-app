import React, { useState, useRef, useEffect } from 'react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer || data.response || JSON.stringify(data) 
        }]);
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">DOC QnA</span>
          </div>
          <nav className="nav">
            <a href="#about" className="nav-link">ABOUT</a>
            <a href="#features" className="nav-link">FEATURES</a>
            <a href="#docs" className="nav-link">DOCS</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            NO CONFUSION,
            <br />
            ONLY CLEAR ANSWERS
          </h1>
          <p className="hero-subtitle">
            WE EMPOWER YOU TO FIND BOLD SOLUTIONS THAT UNLOCK
            <br />
            YOUR DOCUMENTS AND ELIMINATE UNCERTAINTY.
          </p>
          <button className="cta-button" onClick={() => document.querySelector('.message-input')?.focus()}>
            ASK QUESTIONS
          </button>
        </div>
        
        {/* Decorative Globe */}
        <div className="globe-container">
          <div className="globe"></div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-card">
          <div className="card-header">
            <div className="card-icon">💬</div>
            <h3 className="card-title">RAG BASED QnA APPLICATION BY SUDHANSHU</h3>
          </div>
          <p className="card-description">
            ASK QUESTIONS ABOUT YOUR UPLOADED DOCUMENTS AND GET
            INSTANT, ACCURATE ANSWERS.
          </p>
        </div>

        {/* Messages Container */}
        <div className="messages-wrapper">
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-title">Ready to analyze your documents</p>
                <p className="empty-subtitle">
                  Upload a PDF and start asking questions to get instant answers
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : message.role === 'error' ? '⚠️' : '🤖'}
                </div>
                <div className="message-bubble">
                  <div className="message-header">
                    {message.role === 'user' ? 'You' : message.role === 'error' ? 'Error' : 'AI Assistant'}
                  </div>
                  <div className="message-text">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble loading">
                  <div className="message-header">AI Assistant</div>
                  <div className="message-text">
                    <span className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ASK A QUESTION ABOUT YOUR DOCUMENT..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? '⟳' : '→'}
          </button>
        </form>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .app-container {
          min-height: 100vh;
          background: #000000;
          color: #ffffff;
          font-family: 'Courier New', 'Courier', monospace;
          overflow-x: hidden;
        }

        /* Header */
        .header {
          background: #000000;
          border-bottom: 2px solid #FFD700;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
          font-size: 1.2rem;
          color: #FFD700;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .nav {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #FFD700;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          transition: opacity 0.3s;
        }

        .nav-link:hover {
          opacity: 0.7;
        }

        /* Hero Section */
        .hero-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
        }

        .hero-content {
          flex: 1;
          z-index: 2;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          color: #FFD700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: #CCCCCC;
          margin-bottom: 2rem;
          line-height: 1.6;
          letter-spacing: 0.5px;
        }

        .cta-button {
          background: #FFD700;
          color: #000000;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 1px;
          font-family: 'Courier New', monospace;
          border: 2px solid #FFD700;
        }

        .cta-button:hover {
          background: transparent;
          color: #FFD700;
          transform: translateY(-2px);
        }

        /* Globe Decoration */
        .globe-container {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 500px;
          height: 500px;
          z-index: 1;
        }

        .globe {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1), transparent);
          border: 1px solid rgba(255, 215, 0, 0.2);
          position: relative;
          animation: rotate 20s linear infinite;
        }

        .globe::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255, 215, 0, 0.1) 20px, rgba(255, 215, 0, 0.1) 22px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255, 215, 0, 0.1) 20px, rgba(255, 215, 0, 0.1) 22px);
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Chat Section */
        .chat-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
        }

        .chat-card {
          background: rgba(255, 215, 0, 0.05);
          border: 2px solid #FFD700;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          font-size: 1.5rem;
        }

        .card-title {
          font-size: 1.2rem;
          color: #FFD700;
          letter-spacing: 2px;
        }

        .card-description {
          color: #CCCCCC;
          line-height: 1.6;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        /* Messages */
        .messages-wrapper {
          background: rgba(255, 215, 0, 0.03);
          border: 1px solid rgba(255, 215, 0, 0.2);
          margin-bottom: 1rem;
          max-height: 500px;
          overflow: hidden;
        }

        .messages-container {
          height: 500px;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .empty-title {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .empty-subtitle {
          color: #888888;
          font-size: 0.9rem;
        }

        .message {
          display: flex;
          gap: 1rem;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #FFD700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .message-bubble {
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.3);
          padding: 1rem;
          border-radius: 4px;
          max-width: 70%;
        }

        .message.user .message-bubble {
          background: rgba(255, 215, 0, 0.1);
          border-color: #FFD700;
        }

        .message.error .message-bubble {
          background: rgba(255, 0, 0, 0.1);
          border-color: #FF0000;
        }

        .message-header {
          color: #FFD700;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .message-text {
          color: #FFFFFF;
          line-height: 1.6;
          font-size: 0.9rem;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message.error .message-text {
          color: #FF6666;
        }

        /* Typing Animation */
        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #FFD700;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* Input Form */
        .input-form {
          display: flex;
          gap: 1rem;
          background: #000000;
          border: 2px solid #FFD700;
          padding: 1rem;
        }

        .message-input {
          flex: 1;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFFFFF;
          padding: 1rem;
          font-size: 0.9rem;
          outline: none;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.5px;
        }

        .message-input::placeholder {
          color: #666666;
          letter-spacing: 0.5px;
        }

        .message-input:focus {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.08);
        }

        .message-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-button {
          width: 60px;
          background: #FFD700;
          color: #000000;
          border: none;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Courier New', monospace;
        }

        .send-button:hover:not(:disabled) {
          background: #000000;
          color: #FFD700;
          border: 2px solid #FFD700;
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(255, 215, 0, 0.05);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .globe-container {
            opacity: 0.3;
            width: 400px;
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .nav {
            display: none;
          }

          .hero-section {
            padding: 2rem 1rem;
          }

          .globe-container {
            display: none;
          }

          .message-bubble {
            max-width: 85%;
          }

          .chat-section {
            padding: 0 1rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatApp;