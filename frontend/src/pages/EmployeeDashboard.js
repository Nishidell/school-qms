import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaBuilding, FaSignOutAlt, FaBullhorn, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [counter, setCounter] = useState(1); // Default to Counter 1
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Kick them out if not logged in
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchDepartmentTickets(decoded.service_type);

      // Refresh the waiting list every 3 seconds automatically
      const interval = setInterval(() => {
        fetchDepartmentTickets(decoded.service_type);
      }, 3000);
      return () => clearInterval(interval);
      
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDepartmentTickets = async (dept) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/tickets?dept=${dept}`);
      setTickets(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCallNext = async () => {
    try {
      const res = await axios.put('http://localhost:5001/api/tickets/call-next', { 
        counter: counter,
        dept: user.service_type 
      });
      
      // We can use a browser text-to-speech to actually announce it! (Optional but cool)
      const speech = new SpeechSynthesisUtterance(`Ticket ${res.data.ticketNumber}, please proceed to counter ${counter}`);
      window.speechSynthesis.speak(speech);

      alert(`Success! Called ${res.data.ticketNumber}`);
      fetchDepartmentTickets(user.service_type); // Refresh list immediately

    } catch (err) {
      alert(err.response?.data?.message || "Error calling ticket");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="emp-container">
      {/* SIDEBAR */}
      <div className="emp-sidebar">
        <h2 style={{ textAlign: 'center', borderBottom: '1px solid white', paddingBottom: '20px' }}>
          Staff Portal
        </h2>
        <div style={{ marginTop: '20px', fontSize: '16px' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserAlt /> <strong>User:</strong> {user?.username}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaBuilding /> <strong>Dept:</strong> <span style={{ textTransform: 'uppercase', color: '#f1c40f' }}>{user?.service_type}</span>
          </p>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="emp-main">
        
        {/* CALL CONTROLS */}
        <div className="emp-card">
          <h1>Welcome, {user?.username}</h1>
          <div style={{ marginBottom: '20px', fontSize: '18px' }}>
            <label>I am currently at <strong>Counter:</strong> </label>
            <input 
              type="number" 
              min="1" 
              className="emp-input" 
              value={counter} 
              onChange={(e) => setCounter(e.target.value)} 
            />
          </div>
          
          <button className="call-btn" onClick={handleCallNext} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <FaBullhorn size={24} /> CALL NEXT STUDENT
          </button>
        </div>

        {/* WAITING LIST */}
        <div className="emp-card" style={{ textAlign: 'left' }}>
          <h2>Currently Waiting: <span style={{ color: '#e74c3c' }}>{tickets.length}</span></h2>
          {tickets.length === 0 ? (
            <p style={{ color: 'gray', fontStyle: 'italic' }}>No students are currently waiting for your department.</p>
          ) : (
            <ul className="queue-list">
              {tickets.map(t => (
                <li key={t.id} className="queue-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaTicketAlt color="#2980b9" />
                    <strong>{t.ticketNumber}</strong>
                  </div>
                  <span>{t.studentName || 'Student'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;