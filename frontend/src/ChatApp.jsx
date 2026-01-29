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

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if we got any response
      if (response.ok) {
        // Try to parse JSON if available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Response data:', data);
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.response || JSON.stringify(data) 
          }]);
        } else {
          // If no JSON, just show success
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Request sent successfully. Check your server console for the response.' 
          }]);
        }
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Error: ${error.message}. Your request was sent but the server might not be responding with data yet.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>PDF Chat Assistant</h1>
        <p>Ask questions about your uploaded documents</p>
        <small style={{ opacity: 0.8, fontSize: '0.8rem' }}>
          Note: Check your server console for agent responses
        </small>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation by asking a question about your documents!</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              The server will process your query and log the results to the console.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              <strong>{message.role === 'user' ? 'You' : message.role === 'error' ? 'Error' : 'Assistant'}:</strong>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <strong>Assistant:</strong>
              <p className="typing-indicator">Processing your query...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          disabled={isLoading}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 900px;
          margin: 0 auto;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chat-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
        }

        .chat-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          text-align: center;
          padding: 2rem;
        }

        .empty-state p {
          margin: 0;
        }

        .message {
          max-width: 80%;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
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
          align-self: flex-end;
        }

        .message.assistant,
        .message.error {
          align-self: flex-start;
        }

        .message-content {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .message.user .message-content {
          background: #667eea;
          color: white;
        }

        .message.error .message-content {
          background: #ff6b6b;
          color: white;
        }

        .message-content strong {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .message-content p {
          margin: 0;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .typing-indicator {
          font-style: italic;
          opacity: 0.7;
        }

        .input-form {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 24px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .message-input:focus {
          border-color: #667eea;
        }

        .message-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .send-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .send-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}

export default ChatApp;