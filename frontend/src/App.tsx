import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SearchLeads from './pages/SearchLeads';
import SavedLeads from './pages/SavedLeads';
import LeadDetails from './pages/LeadDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchLeads />} />
          <Route path="/saved" element={<SavedLeads />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
