import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kiosk.css';

function Kiosk() {
  const [services, setServices] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Fetch the latest services from the Admin's database
  useEffect(() => {
    axios.get('http://localhost:5001/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGetTicket = async (e) => {
    e.preventDefault();
    if (!selectedService) return alert("Please select a service");

    try {
      const res = await axios.post('http://localhost:5001/api/tickets', { 
        studentName, // We should add a 'studentName' column to the tickets table in MySQL!
        serviceType: selectedService 
      });
      alert(`Success! ${studentName}, your ticket is: ${res.data.ticketNumber}`);
      setStudentName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="kiosk-container">
    <div className="kiosk-left">
      <h1>Welcome, Student!</h1>
      <form onSubmit={handleGetTicket} className="kiosk-form">
        <label>Full Name:</label>
        <input 
          className="kiosk-input"
          value={studentName} 
          onChange={(e) => setStudentName(e.target.value)} 
          placeholder="Enter your name" 
          required 
        />
        
        <label>Select Service:</label>
        <select 
          className="kiosk-input"
          value={selectedService} 
          onChange={(e) => setSelectedService(e.target.value)} 
          required
        >
          <option value="">-- Choose a Department --</option>
          {services.map(s => (
            <option key={s.id} value={s.service_name}>{s.service_name}</option>
          ))}
        </select>

        <button type="submit" className="kiosk-btn">PRINT TICKET</button>
      </form>
    </div>

    {/* RIGHT HALF: School Video/Branding */}
      <div className="kiosk-right">
        
        {/* Extra Space Above */}
        <div className="right-top-space">
            {/* You can put a School Logo or "Announcements" text here later */}
        </div>

        {/* The Video */}
        <div className="video-wrapper">
          <video autoPlay muted loop playsInline className="video-player">
            <source src={`${process.env.PUBLIC_URL}/ELECTRON.mp4`} type="video/mp4" />
          </video>
        </div>

        {/* Extra Space Below */}
        <div className="right-bottom-space">
            {/* You can put a running ticker or date/time here later */}
        </div>

      </div>
  </div>
  );
}


export default Kiosk;