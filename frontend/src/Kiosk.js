import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* LEFT HALF: Input Form */}
      <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Welcome, Student!</h1>
        <p>Please enter your details to get a queue ticket.</p>
        
        <form onSubmit={handleGetTicket} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label>Full Name:</label>
            <input 
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label>Select Service:</label>
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">-- Choose a Department --</option>
              {services.map(s => (
                <option key={s.id} value={s.service_name}>{s.service_name}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={btnStyle}>PRINT TICKET</button>
        </form>
      </div>

      {/* RIGHT HALF: School Video/Branding */}
      <div style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
          }}
        >
          <source src={`${process.env.PUBLIC_URL}/ELECTRON.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional: Dark Overlay with School Name */}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '40px', 
          color: 'white', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)' 
        }}>
        </div>
      </div>
      
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginTop: '5px' };
const btnStyle = { padding: '20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default Kiosk;