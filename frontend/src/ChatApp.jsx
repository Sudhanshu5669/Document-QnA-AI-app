import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, AlertTriangle, Zap } from 'lucide-react';

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
      height: 'calc(100vh - 4rem)',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{
            background: 'var(--gradient-primary)',
            padding: '0.75rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-primary)'
          }}
        >
          <Sparkles size={24} color="#000" />
        </motion.div>
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Assistant
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Ask me anything about your documents
          </p>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '1.5rem'
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: 'var(--gradient-primary)',
                  padding: '2rem',
                  borderRadius: '24px',
                  boxShadow: 'var(--glow-strong)'
                }}
              >
                <Bot size={64} color="#000" />
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Ready to assist you
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  Start by asking a question about your documents
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                delay: idx * 0.05
              }}
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: msg.role === 'user'
                    ? 'var(--gradient-secondary)'
                    : msg.role === 'error'
                      ? 'var(--accent-error)'
                      : 'var(--gradient-primary)',
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: msg.role === 'user' ? 'var(--glow-secondary)' : 'var(--glow-primary)'
                }}
              >
                {msg.role === 'user' ? (
                  <User size={20} color="#000" />
                ) : msg.role === 'error' ? (
                  <AlertTriangle size={20} color="#fff" />
                ) : (
                  <Bot size={20} color="#000" />
                )}
              </motion.div>

              {/* Message Bubble */}
              <div style={{
                maxWidth: '75%',
                background: msg.role === 'user'
                  ? 'var(--gradient-secondary)'
                  : msg.role === 'error'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                padding: '1.25rem',
                borderRadius: '18px',
                borderTopRightRadius: msg.role === 'user' ? 4 : 18,
                borderTopLeftRadius: msg.role !== 'user' ? 4 : 18,
                lineHeight: 1.7,
                fontSize: '1rem',
                border: `1px solid ${msg.role === 'error' ? 'var(--accent-error)' : 'var(--border-color)'}`,
                boxShadow: 'var(--shadow-md)',
                color: msg.role === 'user' ? '#000' : 'var(--text-primary)',
                fontWeight: msg.role === 'user' ? 600 : 400
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--glow-primary)'
              }}>
                <Bot size={20} color="#000" />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.25rem',
                borderRadius: '18px',
                borderTopLeftRadius: 4,
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                border: '1px solid var(--border-color)'
              }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--accent-primary)'
                    }}
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
        padding: '1.5rem 2rem',
        background: 'rgba(10, 10, 15, 0.95)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={{
              width: '100%',
              background: 'var(--bg-glass)',
              border: '2px solid var(--border-color)',
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: 500
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = 'var(--glow-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: input.trim() && !isLoading ? 1.05 : 1 }}
          whileTap={{ scale: input.trim() && !isLoading ? 0.95 : 1 }}
          style={{
            background: input.trim() && !isLoading
              ? 'var(--gradient-primary)'
              : 'var(--bg-card)',
            color: input.trim() && !isLoading ? '#000' : 'var(--text-secondary)',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            border: '2px solid var(--border-color)',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: input.trim() && !isLoading ? 'var(--glow-primary)' : 'none'
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={24} />
            </motion.div>
          ) : (
            <Send size={22} strokeWidth={2.5} />
          )}
        </motion.button>
      </form>
    </div>
  );
}

export default ChatApp;
