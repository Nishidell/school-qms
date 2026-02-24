import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kiosk.css';

function Kiosk() {
  const [services, setServices] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  // NEW: State to hold our dynamic settings
  const [settings, setSettings] = useState({
    primary_color: '#27ae60', // Default green
    secondary_color: '#2c3e50', // Default dark blue
    video_path: ''
  });

  useEffect(() => {
    // Fetch Services
    axios.get('http://localhost:5001/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));

    // NEW: Fetch Settings
    axios.get('http://localhost:5001/api/settings')
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleGetTicket = async (e) => {
    e.preventDefault();
    if (!selectedService) return alert("Please select a service");

    try {
      const res = await axios.post('http://localhost:5001/api/tickets', { 
        studentName, serviceType: selectedService 
      });
      alert(`Success! ${studentName}, your ticket is: ${res.data.ticketNumber}`);
      setStudentName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="kiosk-container">
      
      {/* LEFT HALF */}
      <div className="kiosk-left">
        <h1 style={{ color: settings.secondary_color }}>Welcome, Student!</h1>
        <form onSubmit={handleGetTicket} className="kiosk-form">
          <label>Full Name:</label>
          <input className="kiosk-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your name" required />
          
          <label>Select Service:</label>
          <select className="kiosk-input" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
            <option value="">-- Choose a Department --</option>
            {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name}</option>)}
          </select>

          {/* DYNAMIC BUTTON COLOR */}
          <button type="submit" className="kiosk-btn" style={{ backgroundColor: settings.primary_color }}>
            PRINT TICKET
          </button>
        </form>
      </div>

      {/* RIGHT HALF */}
      {/* DYNAMIC BACKGROUND COLOR */}
      <div className="kiosk-right" style={{ backgroundColor: settings.secondary_color }}>
        <div className="right-top-space"></div>

        <div className="video-wrapper">
          {/* REACT MAGIC TRICK: Changing the 'key' forces the video player to reload when a new video is uploaded! */}
          <video key={settings.video_path} autoPlay muted loop playsInline className="video-player">
            <source 
              src={settings.video_path ? `http://localhost:5001/uploads/${settings.video_path}` : `${process.env.PUBLIC_URL}/school-video.mp4`} 
              type="video/mp4" 
            />
          </video>
        </div>

        <div className="right-bottom-space"></div>
      </div>
      
    </div>
  );
}

export default Kiosk;