import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, AlertTriangle } from 'lucide-react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer || data.response || JSON.stringify(data)
        }]);
      } else {
        throw new Error(`Server status: ${response.status}`);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 4rem)', // Adjust for layout padding
      maxWidth: '1000px',
      margin: '0 auto',
      background: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(5, 5, 5, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'var(--accent-glow)',
          padding: '0.5rem',
          borderRadius: '12px'
        }}>
          <Sparkles size={24} color="var(--accent-primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Assistant</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ready to answer your questions</p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }} className="scroll-smooth">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                opacity: 0.5
              }}
            >
              <Bot size={64} style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }} />
              <p>Ask anything about your documents.</p>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: msg.role === 'user' ? 'var(--accent-secondary)' : 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={18} /> : msg.role === 'error' ? <AlertTriangle size={18} color="red" /> : <Bot size={18} color="var(--accent-primary)" />}
              </div>

              <div style={{
                maxWidth: '70%',
                background: msg.role === 'user' ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? 4 : 16,
                borderTopLeftRadius: msg.role !== 'user' ? 4 : 16,
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', gap: '1rem' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="var(--accent-primary)" />
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        padding: '1.5rem',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '1rem'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '1rem'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            background: 'var(--accent-primary)',
            color: '#000',
            width: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            opacity: (!input.trim() || isLoading) ? 0.5 : 1
          }}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatApp;