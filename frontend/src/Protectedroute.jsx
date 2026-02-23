import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

// Shows a minimal loading state while we verify the cookie,
// then either renders the page or redirects to /login.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("ok: ",user);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0B0B0D',
        fontFamily: "'Syne', sans-serif",
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Animated gold dot */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#E4A838',
                  animation: `bounce 0.9s ease-in-out ${i * 0.18}s infinite`,
                }}
              />
            ))}
          </div>
          <p style={{ color: '#3E3C38', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Verifying session
          </p>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.3; }
            50% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;