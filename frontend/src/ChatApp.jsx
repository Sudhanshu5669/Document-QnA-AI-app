import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertTriangle, Zap, FileSearch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
const ura = import.meta.env.VITE_BACKEND_URL;

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch(ura + '/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer || data.response || JSON.stringify(data),
        }]);
      } else {
        throw new Error(`Server error ${response.status}`);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: error.message }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 4rem)',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: "'Syne', sans-serif",
    }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11,11,13,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'rgba(228,168,56,0.1)', border: '1px solid rgba(228,168,56,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileSearch size={18} color="#E4A838" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#F0EBE1',
              lineHeight: 1,
            }}>
              Document Assistant
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#3E3C38', marginTop: '0.2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              RAG · Gemini 2.5 Flash
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(77,168,130,0.08)', border: '1px solid rgba(77,168,130,0.2)',
          borderRadius: '20px', padding: '0.3rem 0.75rem',
        }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4DA882' }}
          />
          <span style={{ fontSize: '0.7rem', color: '#4DA882', fontWeight: 600, letterSpacing: '0.06em' }}>ONLINE</span>
        </div>
      </motion.div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '100%', gap: '2rem', textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: 'rgba(228,168,56,0.08)', border: '1px solid rgba(228,168,56,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(228,168,56,0.08)',
                }}
              >
                <FileSearch size={36} color="#E4A838" />
              </motion.div>
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', fontWeight: 600, fontStyle: 'italic',
                  color: '#F0EBE1', marginBottom: '0.5rem',
                }}>
                  Ready to answer.
                </h3>
                <p style={{ color: '#7A756E', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Ask anything about your uploaded documents.
                </p>
              </div>

              {/* Suggested prompts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '480px' }}>
                {['Summarise this document', 'What are the key points?', 'List the main requirements'].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    style={{
                      background: 'rgba(228,168,56,0.06)', border: '1px solid rgba(228,168,56,0.15)',
                      borderRadius: '20px', padding: '0.4rem 0.9rem',
                      color: '#7A756E', fontSize: '0.78rem', fontFamily: "'Syne', sans-serif",
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E4A838'; e.currentTarget.style.borderColor = 'rgba(228,168,56,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#7A756E'; e.currentTarget.style.borderColor = 'rgba(228,168,56,0.15)'; }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: msg.role === 'user'
                  ? '#E4A838'
                  : msg.role === 'error'
                    ? 'rgba(217,95,75,0.15)'
                    : 'rgba(228,168,56,0.08)',
                border: `1px solid ${msg.role === 'user' ? 'transparent' : msg.role === 'error' ? 'rgba(217,95,75,0.3)' : 'rgba(228,168,56,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {msg.role === 'user'
                  ? <User size={16} color="#0B0B0D" />
                  : msg.role === 'error'
                    ? <AlertTriangle size={16} color="#D95F4B" />
                    : <Bot size={16} color="#E4A838" />}
              </div>

              {/* Bubble */}
              <div
                className={msg.role === 'assistant' ? 'markdown' : undefined}
                style={{
                  maxWidth: '72%',
                  padding: '0.875rem 1.1rem',
                  borderRadius: '12px',
                  borderTopRightRadius: msg.role === 'user' ? '3px' : '12px',
                  borderTopLeftRadius: msg.role !== 'user' ? '3px' : '12px',
                  background: msg.role === 'user'
                    ? '#E4A838'
                    : msg.role === 'error'
                      ? 'rgba(217,95,75,0.07)'
                      : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    msg.role === 'user'
                      ? 'transparent'
                      : msg.role === 'error'
                        ? 'rgba(217,95,75,0.2)'
                        : 'rgba(255,255,255,0.06)'
                  }`,
                  color: msg.role === 'user' ? '#0B0B0D' : msg.role === 'error' ? '#D95F4B' : '#F0EBE1',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  fontWeight: msg.role === 'user' ? 600 : 400,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
              >
                {msg.role === 'assistant'
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content
                }
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(228,168,56,0.08)', border: '1px solid rgba(228,168,56,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={16} color="#E4A838" />
              </div>
              <div style={{
                padding: '0.875rem 1.1rem', borderRadius: '12px', borderTopLeftRadius: '3px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '5px', alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E4A838' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1.25rem 1.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(11,11,13,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your documents..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '0.875rem 1.1rem',
                borderRadius: '10px',
                color: '#F0EBE1',
                outline: 'none',
                fontSize: '0.9rem',
                fontFamily: "'Syne', sans-serif",
                transition: 'border-color 0.2s, box-shadow 0.2s',
                letterSpacing: '0.01em',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(228,168,56,0.4)';
                e.target.style.boxShadow = '0 0 0 3px rgba(228,168,56,0.06)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={input.trim() && !isLoading ? { scale: 1.04 } : {}}
            whileTap={input.trim() && !isLoading ? { scale: 0.96 } : {}}
            style={{
              width: '46px', height: '46px', borderRadius: '10px', flexShrink: 0,
              background: input.trim() && !isLoading ? '#E4A838' : 'rgba(255,255,255,0.04)',
              border: '1px solid',
              borderColor: input.trim() && !isLoading ? 'transparent' : 'rgba(255,255,255,0.07)',
              color: input.trim() && !isLoading ? '#0B0B0D' : '#3E3C38',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: input.trim() && !isLoading ? '0 4px 16px rgba(228,168,56,0.2)' : 'none',
            }}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Zap size={18} />
              </motion.div>
            ) : (
              <Send size={17} strokeWidth={2.5} />
            )}
          </motion.button>
        </form>
        <p style={{ marginTop: '0.6rem', fontSize: '0.7rem', color: '#3E3C38', textAlign: 'center', letterSpacing: '0.03em' }}>
          Answers are based solely on your uploaded documents.
        </p>
      </div>
    </div>
  );
}

export default ChatApp;