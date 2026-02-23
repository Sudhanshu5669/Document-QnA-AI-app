import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, ShieldCheck } from 'lucide-react';

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

const IconWrap = ({ children }) => (
  <span style={{
    position: 'absolute', left: '0.9rem', top: '50%',
    transform: 'translateY(-50%)', pointerEvents: 'none',
    display: 'flex', alignItems: 'center',
  }}>
    {children}
  </span>
);

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const focusStyle = e => {
    e.target.style.borderColor = 'rgba(228,168,56,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(228,168,56,0.06)';
  };
  const blurStyle = e => {
    e.target.style.borderColor = 'rgba(255,255,255,0.07)';
    e.target.style.boxShadow = 'none';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.name, email: formData.email, password: formData.password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Signup failed.');
        return;
      }
      navigate('/login');
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

      {/* Ambient */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(228,168,56,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(228,168,56,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '4%', left: '4%',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(4rem, 12vw, 10rem)',
        fontWeight: 600,
        fontStyle: 'italic',
        color: 'rgba(228,168,56,0.025)',
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
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        <div style={{
          background: '#16161A',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '2.5rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
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
                Create Account
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#F0EBE1',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '0.4rem',
              }}
            >
              Join the workspace.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ color: '#7A756E', fontSize: '0.875rem', lineHeight: 1.5 }}
            >
              Start analyzing your documents in seconds.
            </motion.p>
          </div>

          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(228,168,56,0.3) 0%, rgba(255,255,255,0.04) 100%)',
            marginBottom: '1.75rem',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '0.7rem 1rem', borderRadius: '7px',
                  background: 'rgba(217,95,75,0.08)', border: '1px solid rgba(217,95,75,0.25)',
                  color: '#D95F4B', fontSize: '0.82rem', lineHeight: 1.5,
                }}
              >
                {error}
              </motion.div>
            )}

            {[
              { name: 'name', type: 'text', placeholder: 'Full name', Icon: User },
              { name: 'email', type: 'email', placeholder: 'Email address', Icon: Mail },
              { name: 'password', type: 'password', placeholder: 'Password', Icon: Lock },
              { name: 'confirmPassword', type: 'password', placeholder: 'Confirm password', Icon: ShieldCheck },
            ].map(({ name, type, placeholder, Icon }) => (
              <div key={name} style={{ position: 'relative' }}>
                <IconWrap><Icon size={15} color="#3E3C38" /></IconWrap>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            ))}

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
                transition: 'background 0.2s, box-shadow 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(228,168,56,0.25)',
              }}
            >
              {loading ? 'Creating account...' : <>Create account <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#3E3C38', fontSize: '0.82rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E4A838', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;