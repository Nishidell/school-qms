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
    axios.get('/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));

    // NEW: Fetch Settings
    axios.get('/api/settings')
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error(err));
  }, []);

 const handleGetTicket = async (e) => {
    e.preventDefault();
    if (!selectedService) return alert("Please select a service");

    try {
      const res = await axios.post('/api/tickets', { 
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
      {/* 1. ENTIRE SCREEN WRAPPER WITH DOTTED BACKGROUND */}
      <div 
        className="kiosk-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          overflow: 'hidden',
          backgroundColor: settings.secondary_color,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0'
        }}
      >
        
        {/* 2. HEADER (Transparent, just text floating at the top) */}
        <div style={{ 
          padding: '40px 20px 0 20px', 
          textAlign: 'center',
          zIndex: 10
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2.5rem', 
            color: 'white', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontWeight: 'bold',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)' /* Gives the text a nice pop against the dots */
          }}>
            Transaction Queuing Management System
          </h1>
        </div>

       {/* 3. MAIN CONTENT (Left Card & Right Video) */}
        <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* LEFT HALF (35% Width) */}
          <div style={{ width: '35%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 20px 20px 40px' }}>
            <div className="kiosk-form-card">
              <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Welcome, Student!</h1>
              
              <form onSubmit={handleGetTicket} className="kiosk-form">
                <label>Full Name:</label>
                <input className="kiosk-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your name" required />
                
                <label>Select Service:</label>
                <select className="kiosk-input" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
                  <option value="">-- Choose a Department --</option>
                  {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name}</option>)}
                </select>

                <button type="submit" className="kiosk-btn" style={{ backgroundColor: settings.primary_color }}>
                  PRINT TICKET
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT HALF (65% Width) */}
          <div style={{ width: '65%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 40px 20px 20px' }}>
            <div className="video-wrapper">
              <video key={settings.video_path} autoPlay muted loop playsInline className="video-player">
                <source 
                  src={settings.video_path ? `/uploads/${settings.video_path}` : `${process.env.PUBLIC_URL}/school-video.mp4`} 
                  type="video/mp4" 
                />
              </video>
            </div>
          </div>

        </div>
      </div>
      
      {/* --- HIDDEN PRINT RECEIPT --- */}
      {printedTicket && (
        <div className="receipt-container">
          {settings.logo_path && (
            <img 
              src={`/uploads/${settings.logo_path}`} 
              alt="Logo" 
              style={{ maxWidth: '100px', marginBottom: '10px', filter: 'grayscale(100%)' }} 
            />
          )}
          <div className="receipt-header">QUEUE SYSTEM</div>
          <div className="receipt-details"><strong>Name:</strong> {printedTicket.name}</div>
          <div className="receipt-details"><strong>Dept:</strong> {printedTicket.service}</div>
          <div className="receipt-ticket-number">{printedTicket.ticketNumber}</div>
          <div className="receipt-details" style={{ textAlign: 'center', fontSize: '0.9rem' }}>{printedTicket.date}</div>
          <div className="receipt-footer">Please wait for your number to be called.<br/>Thank you!</div>
        </div>
      )}
    </>
  );
}

export default Kiosk;

