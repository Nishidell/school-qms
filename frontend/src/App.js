import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import your pages
import Kiosk from './pages/Kiosk';
import Display from './pages/Display';
import Admin from './pages/Admin';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';

import './App.css'; 

function App() {

  // This runs once when the app first loads
  useEffect(() => {
    axios.get('http://localhost:5001/api/settings')
      .then(res => {
        if (res.data && res.data.logo_path) {
         
          const favicon = document.getElementById('dynamic-favicon');
          if (favicon) {
            // image source based on current logo
            favicon.href = `http://localhost:5001/uploads/${res.data.logo_path}`;
          }
        }
      })
      .catch(err => console.error("Error fetching favicon settings:", err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/display" element={<Display />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;