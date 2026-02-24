import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // You might need to run: npm install jwt-decode

function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchDepartmentTickets(decoded.service_type);
    }
  }, []);

  const fetchDepartmentTickets = async (dept) => {
    try {
      // We will update the backend to support filtering by department next
      const res = await axios.get(`http://localhost:5001/api/tickets?dept=${dept}`);
      setTickets(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>👋 Hello, {user?.role} ({user?.service_type} Dept)</h2>
      <h3>Students waiting for your department:</h3>
      <ul>
        {tickets.map(t => (
          <li key={t.id}>{t.ticketNumber} - {t.serviceType} 
            <button onClick={() => {/* logic to call ticket */}} style={{ marginLeft: '10px' }}>Call</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeDashboard;