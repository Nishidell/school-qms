import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Display.css';

function Display() {
  const [activeCounters, setActiveCounters] = useState([]);
  
  // Settings state
  const [settings, setSettings] = useState({
    primary_color: '#f1c40f', 
    secondary_color: '#1b263b', 
    video_path: ''
  });

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch Settings
    axios.get('http://localhost:5001/api/settings').then(res => {
      if (res.data) setSettings(res.data);
    }).catch(err => console.error(err));

    const fetchServing = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tickets/serving');
        const tickets = res.data;
        
        const uniqueCounters = {};
        tickets.forEach(ticket => {
          if (!uniqueCounters[ticket.counter]) uniqueCounters[ticket.counter] = ticket;
        });

        const sortedCounters = Object.values(uniqueCounters).sort((a, b) => a.counter - b.counter);
        setActiveCounters(sortedCounters);
      } catch (err) { console.error("Error fetching display tickets:", err); }
    };

    fetchServing();
    const interval = setInterval(fetchServing, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="display-container" style={{ backgroundColor: settings.secondary_color }}>
      
      {/* HEADER: Dynamic border and background */}
      <div className="display-header" style={{ borderBottom: `5px solid ${settings.primary_color}`, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <div className="header-box" style={{ backgroundColor: 'transparent' }}>
          {settings.logo_path ? (
            <img 
              src={`http://localhost:5001/uploads/${settings.logo_path}`} 
              alt="School Logo" 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
            />
          ) : (
            <h2 style={{ color: 'white' }}>[ Logo Area ]</h2>
          )}
        </div>
        
        <div className="header-video">
          <video key={settings.video_path} autoPlay muted loop playsInline>
            <source 
              src={settings.video_path ? `http://localhost:5001/uploads/${settings.video_path}` : `${process.env.PUBLIC_URL}/school-video.mp4`} 
              type="video/mp4" 
            />
          </video>
        </div>
        
        <div className="header-box" style={{ backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', paddingRight: '40px' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            margin: '0', 
            color: 'white', 
            textShadow: `0 0 15px ${settings.primary_color}80`,
            fontWeight: 'bold',
            lineHeight: '1'
          }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <h3 style={{ 
            fontSize: '1.5rem', 
            margin: '5px 0 0 0', 
            color: settings.primary_color,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' })}
          </h3>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="display-body">
        {activeCounters.length === 0 ? (
          <h1 style={{ textAlign: 'center', color: 'white', opacity: 0.5, fontSize: '3rem' }}>Waiting for tickets...</h1>
        ) : (
          <div className="windows-grid">
            {activeCounters.map(ticket => (
              <div key={ticket.counter} className="window-card" style={{ borderTop: `8px solid ${settings.primary_color}` }}>
                <h2 className="window-title">Counter {ticket.counter}</h2>
                <h1 className="window-ticket" style={{ color: settings.primary_color, textShadow: `0 0 15px ${settings.primary_color}80` }}>
                  {ticket.ticketNumber}
                </h1>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Display;