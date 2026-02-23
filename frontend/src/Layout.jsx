import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, Menu, X, FileSearch, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from './Authcontext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
    { path: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: '#0B0B0D',
      position: 'relative',
      fontFamily: "'Syne', sans-serif",
    }}>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '1.25rem',
          zIndex: 1000,
          background: 'rgba(22,22,26,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        {isOpen
          ? <X size={20} color="#F0EBE1" />
          : <Menu size={20} color="#F0EBE1" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden"
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 998,
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={{ x: isOpen ? 0 : -260 }}
        style={{
          width: '260px',
          background: 'rgba(16,16,20,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.25rem',
          height: '100vh',
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 999,
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="sidebar"
      >

        {/* Brand */}
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(228,168,56,0.1)', border: '1px solid rgba(228,168,56,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FileSearch size={16} color="#E4A838" />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#F0EBE1',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              DocAI
            </span>
          </div>
          <p style={{
            fontSize: '0.7rem',
            color: '#3E3C38',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            paddingLeft: '0.25rem',
          }}>
            Document Intelligence
          </p>
        </div>

        {/* Gold hairline divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(228,168,56,0.25) 0%, transparent 100%)',
          marginBottom: '1.5rem',
        }} />

        {/* Nav label */}
        <p style={{
          fontSize: '0.65rem',
          color: '#3E3C38',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '0.6rem',
          paddingLeft: '0.5rem',
        }}>
          Navigation
        </p>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {navItems.map((item, index) => (
            <Link
              to={item.path}
              key={item.path}
              style={{ textDecoration: 'none' }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '9px',
                  background: isActive(item.path)
                    ? 'rgba(228,168,56,0.1)'
                    : 'transparent',
                  border: `1px solid ${isActive(item.path) ? 'rgba(228,168,56,0.25)' : 'transparent'}`,
                  color: isActive(item.path) ? '#E4A838' : '#7A756E',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.color = '#F0EBE1';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.color = '#7A756E';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={17} strokeWidth={2} />
                {item.label}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer — logout */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.05)',
            marginBottom: '1.25rem',
          }} />

          <motion.button
            onClick={() => logout(navigate)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              background: 'transparent',
              border: '1px solid transparent',
              color: '#3E3C38',
              fontSize: '0.875rem',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#D95F4B';
              e.currentTarget.style.background = 'rgba(217,95,75,0.07)';
              e.currentTarget.style.borderColor = 'rgba(217,95,75,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#3E3C38';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={17} strokeWidth={2} />
            Sign out
          </motion.button>

          <p style={{
            marginTop: '1rem',
            fontSize: '0.65rem',
            color: '#3E3C38',
            opacity: 0.5,
            paddingLeft: '0.5rem',
            letterSpacing: '0.05em',
          }}>
            © 2026 DocAI
          </p>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '2rem',
          overflowY: 'auto',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { width: 260px !important; }
          .main-content { margin-left: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;