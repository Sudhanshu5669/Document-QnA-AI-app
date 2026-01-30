import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ChatApp from './ChatApp';
import Upload from './Upload';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatApp />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;