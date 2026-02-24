import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kiosk from './Kiosk';
import Display from './Display';
import Admin from './Admin'
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';

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