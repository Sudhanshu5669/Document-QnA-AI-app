import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const ura = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // null = unknown, false = logged out, object = logged in
  const [loading, setLoading] = useState(true); // true while we verify the cookie on first load

  // On mount, hit the backend to check if the existing cookie is valid.
  // Add a GET /auth/me route to your backend that calls verifyToken and returns req.user.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch( ura + '/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // expects { id, email, ... }
        } else {
          setUser(false);
        }
      } catch {
        setUser(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async (navigate) => {
    try {
      await fetch(ura + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Even if the request fails, clear local state
    }
    setUser(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);