import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kiosk from './pages/Kiosk';
import Display from './pages/Display';
import Admin from './pages/Admin';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/display" element={<Display />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="login" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;