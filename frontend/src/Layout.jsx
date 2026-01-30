import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Upload, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      {/* Mobile Toggle */}
      <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 100 }} className="md:hidden">
         <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <Menu size={24} color="var(--text-primary)" />
         </button>
      </div>

      {/* Sidebar Navigation */}
      <motion.nav
        initial={false}
        animate={{ width: isOpen ? 240 : 80 }}
        style={{
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1rem',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
        className="sidebar"
      >
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: isOpen ? '1.5rem' : '0rem', 
            fontWeight: 800, 
            color: 'var(--accent-primary)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap'
          }}>
            DOC AI
          </h1>
          {!isOpen && <span style={{fontSize: '1.5rem'}}>🤖</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {navItems.map((item) => (
            <Link to={item.path} key={item.path} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: isActive(item.path) ? 'var(--accent-glow)' : 'transparent',
                  border: isActive(item.path) ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  gap: '1rem'
                }}
              >
                <item.icon size={24} />
                {isOpen && (
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div style={{ marginTop: 'auto' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: '1px solid var(--border-color)',
                    marginTop: '1rem'
                }}
            >
                {isOpen ? '«' : '»'}
            </button>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: 'calc(100vw - 80px)' }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
