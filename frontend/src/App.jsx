import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ChatApp from './ChatApp';
import Upload from './Upload';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<ChatApp />} />
                <Route path="/upload" element={<Upload />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;