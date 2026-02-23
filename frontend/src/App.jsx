import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Authcontext';
import ProtectedRoute from './Protectedroute';
import Layout from './Layout';
import ChatApp from './ChatApp';
import Upload from './Upload';
import Login from './Login';
import Signup from './Signup';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public — redirect away if already logged in */}
      <Route path="/login"  element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

      {/* Protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/"       element={<ChatApp />} />
                <Route path="/upload" element={<Upload />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;