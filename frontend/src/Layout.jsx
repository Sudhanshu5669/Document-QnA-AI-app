import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Upload, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
    { path: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 1000,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          boxShadow: 'var(--shadow-md)'
        }}
        className="md:hidden"
      >
        {isOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 998,
              backdropFilter: 'blur(4px)'
            }}
            className="md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.nav
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          width: 280
        }}
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          boxShadow: 'var(--shadow-xl)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="sidebar"
      >
        {/* Logo/Brand */}
        <div style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{
              background: 'var(--gradient-primary)',
              padding: '0.75rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-primary)'
            }}>
              <Sparkles size={28} color="#000" />
            </div>
          </motion.div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem'
          }}>
            DOC AI
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Your Intelligent Assistant
          </p>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navItems.map((item, index) => (
            <Link to={item.path} key={item.path} style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  background: isActive(item.path)
                    ? 'var(--gradient-primary)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isActive(item.path) ? 'transparent' : 'var(--border-color)'}`,
                  color: isActive(item.path) ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  gap: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive(item.path) ? 'var(--glow-primary)' : 'none',
                  fontWeight: isActive(item.path) ? 700 : 500
                }}
              >
                <item.icon size={22} strokeWidth={2.5} />
                <span style={{ fontSize: '1rem' }}>{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              marginBottom: '0.25rem'
            }}>
              Powered by AI
            </p>
            <p style={{
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              opacity: 0.6
            }}>
              © 2026 Doc AI
            </p>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        padding: '2rem',
        overflowY: 'auto',
        width: 'calc(100% - 280px)',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
        className="main-content"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            width: 280px !important;
          }
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;

