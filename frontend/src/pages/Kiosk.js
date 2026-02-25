import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kiosk.css';

function Kiosk() {
  const [services, setServices] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const [printedTicket, setPrintedTicket] = useState(null);
  
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
      
      // 1. Save the ticket details for the receipt
      setPrintedTicket({
        ticketNumber: res.data.ticketNumber,
        name: studentName,
        service: selectedService,
        date: new Date().toLocaleString()
      });

      // 2. Clear the form for the next student
      setStudentName('');
      setSelectedService('');

      // 3. Wait a tiny fraction of a second for React to render the receipt, then print!
      setTimeout(() => {
        window.print();
      }, 500);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <div className="kiosk-container">
      
      {/* LEFT HALF */}
      <div 
        className="kiosk-left"
        // NEW: Apply the textured background to the whole left side container!
        style={{ 
          backgroundColor: settings.secondary_color,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* NEW: Wrap the content in the floating card */}
        <div className="kiosk-form-card">
          
          {/* Note: Changed text color back to default dark for readability on white card */}
          <h1 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Welcome, Student!</h1>
          
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

        </div> {/* End of floating card */}
      </div>

      {/* RIGHT HALF */}
      <div 
        className="kiosk-right" 
        style={{ 
          backgroundColor: settings.secondary_color,
          // This creates the repeating dot pattern!
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0'
        }}
      >
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
      
      {/* --- HIDDEN PRINT RECEIPT --- */}
      {printedTicket && (
        <div className="receipt-container">
          {/* Logo on Receipt (if available) */}
          {settings.logo_path && (
            <img 
              src={`http://localhost:5001/uploads/${settings.logo_path}`} 
              alt="Logo" 
              style={{ maxWidth: '100px', marginBottom: '10px', filter: 'grayscale(100%)' }} 
            />
          )}
          
          <div className="receipt-header">
            QUEUE SYSTEM
          </div>
          
          <div className="receipt-details">
            <strong>Name:</strong> {printedTicket.name}
          </div>
          <div className="receipt-details">
            <strong>Dept:</strong> {printedTicket.service}
          </div>

          <div className="receipt-ticket-number">
            {printedTicket.ticketNumber}
          </div>

          <div className="receipt-details" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            {printedTicket.date}
          </div>
          
          <div className="receipt-footer">
            Please wait for your number to be called.<br/>Thank you!
          </div>
        </div>
      )}

    </>
  );
}

export default Kiosk;

