import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from './Authcontext';
const ura = import.meta.env.VITE_BACKEND_URL;

const inputStyle = {
  width: '100%',
  padding: '0.875rem 1rem 0.875rem 2.75rem',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px',
  color: '#F0EBE1',
  fontSize: '0.9rem',
  fontFamily: "'Syne', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  letterSpacing: '0.01em',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${ura}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      
      
      if (!response.ok) {
        console.log("ok");
        setError(data.message || 'Invalid credentials.');
        return;
      }
      setUser(data.user);
      navigate('/');
    } catch {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#0B0B0D',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Syne', sans-serif",
    }}>

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(228,168,56,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(228,168,56,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Background watermark text */}
      <div style={{
        position: 'absolute',
        bottom: '4%',
        right: '4%',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(5rem, 14vw, 12rem)',
        fontWeight: 600,
        fontStyle: 'italic',
        color: 'rgba(228,168,56,0.03)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '-0.02em',
      }}>
        DocAI
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Card */}
        <div style={{
          background: '#16161A',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '2.5rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div style={{
                display: 'inline-block',
                background: 'rgba(228,168,56,0.1)',
                border: '1px solid rgba(228,168,56,0.2)',
                borderRadius: '6px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E4A838',
                marginBottom: '1.25rem',
              }}>
                Sign In
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.6rem',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#F0EBE1',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '0.4rem',
              }}
            >
              Welcome back.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ color: '#7A756E', fontSize: '0.875rem', lineHeight: 1.5 }}
            >
              Continue to your document workspace.
            </motion.p>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(228,168,56,0.3) 0%, rgba(255,255,255,0.04) 100%)',
            marginBottom: '1.75rem',
          }} />

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '7px',
                  background: 'rgba(217, 95, 75, 0.08)',
                  border: '1px solid rgba(217, 95, 75, 0.25)',
                  color: '#D95F4B',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                color="#3E3C38"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(228,168,56,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(228,168,56,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                color="#3E3C38"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(228,168,56,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(228,168,56,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              style={{
                marginTop: '0.5rem',
                padding: '0.9rem 1.5rem',
                borderRadius: '8px',
                background: loading ? 'rgba(228,168,56,0.3)' : '#E4A838',
                border: 'none',
                color: '#0B0B0D',
                fontSize: '0.875rem',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(228,168,56,0.25)',
              }}
            >
              {loading ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#3E3C38',
            fontSize: '0.82rem',
          }}>
            No account?{' '}
            <Link to="/signup" style={{
              color: '#E4A838',
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;