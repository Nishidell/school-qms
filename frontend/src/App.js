import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Kiosk from './pages/Kiosk';
import Display from './pages/Display';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Employee from './pages/EmployeeDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* The System Hub */}
        <Route path="/" element={<Home />} />

        {/* The Public Endpoints */}
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/display" element={<Display />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* The Protected Portals */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<Employee />} /> 
      </Routes>
    </Router>
  );
}

export default App;