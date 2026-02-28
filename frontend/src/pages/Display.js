import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Display.css';

function Display() {
  const [activeCounters, setActiveCounters] = useState([]);
  
  // State to hold the services so we know their custom window names
  const [services, setServices] = useState([]);
  
  const [settings, setSettings] = useState({
    primary_color: '#f1c40f', 
    secondary_color: '#1b263b', 
    video_path: ''
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch Settings
    axios.get('/api/settings').then(res => {
      if (res.data) setSettings(res.data);
    }).catch(err => console.error(err));

    // Fetch Services list so we can map departments to their custom windows
    axios.get('/api/services').then(res => {
      if (res.data) setServices(res.data);
    }).catch(err => console.error(err));

    const fetchServing = async () => {
      try {
        const res = await axios.get('/api/tickets/serving');
        const tickets = res.data;
        
        // CRUCIAL DEBUGGER: This will print the exact database info to your browser!
        console.log("🔍 TICKETS FROM DATABASE:", tickets);
        
        const uniqueCounters = {};
        
        tickets.forEach(ticket => {
          // THE BULLETPROOF FIX: We check every single possible name your database might be using
          const departmentName = ticket.service_type || ticket.serviceType || ticket.service || ticket.department || 'Unknown';
          
          if (!uniqueCounters[departmentName]) {
            uniqueCounters[departmentName] = ticket;
          }
        });

        const sortedCounters = Object.values(uniqueCounters);
        setActiveCounters(sortedCounters);
      } catch (err) { 
        console.error("Error fetching display tickets:", err); 
      }
    };

    fetchServing();
    const interval = setInterval(fetchServing, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="display-container" style={{ backgroundColor: settings.secondary_color }}>
      
      <div className="display-header" style={{ borderBottom: `5px solid ${settings.primary_color}`, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <div className="header-box" style={{ backgroundColor: 'transparent' }}>
          {settings.logo_path ? (
            <img src={settings.logo_path} alt="School Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}/>
          ) : (
            <h2 style={{ color: 'white' }}>[ Logo Area ]</h2>
          )}
        </div>
        
        <div className="header-video">
          <video key={settings.video_path} autoPlay muted loop playsInline>
            <source 
              src={settings.video_path || `${process.env.PUBLIC_URL}/school-video.mp4`} 
              type="video/mp4" 
            />
          </video>
        </div>
        
        <div className="header-box" style={{ backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', paddingRight: '40px' }}>
          <h1 style={{ fontSize: '4rem', margin: '0', color: 'white', textShadow: `0 0 15px ${settings.primary_color}80`, fontWeight: 'bold', lineHeight: '1' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <h3 style={{ fontSize: '1.5rem', margin: '5px 0 0 0', color: settings.primary_color, textTransform: 'uppercase', letterSpacing: '2px' }}>
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' })}
          </h3>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="display-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 20px' }}>
        
        {/* 1. SLIMMER "NOW SERVING" HEADER BAR */}
        <div style={{ 
          width: '100%', 
          textAlign: 'center', 
          padding: '5px 0', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          marginBottom: '10px', 
          borderBottom: `2px solid ${settings.primary_color}40`,
          borderRadius: '10px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: settings.primary_color, 
            fontSize: '2rem', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '5px',
            textShadow: `0 0 15px ${settings.primary_color}60`
          }}>
            Now Serving
          </h1>
        </div>

        {activeCounters.length === 0 ? (
          <h1 style={{ textAlign: 'center', color: 'white', opacity: 0.5, fontSize: '3rem', marginTop: '20px' }}>Waiting for tickets...</h1>
        ) : (
          <div className="windows-grid">
            {activeCounters.map(ticket => {
              
              const departmentName = ticket.service_type || ticket.serviceType || ticket.service || ticket.department || 'Unknown';
              const serviceInfo = services.find(s => s.service_name === departmentName);
              const windowName = serviceInfo && serviceInfo.counter_name ? serviceInfo.counter_name : departmentName;

              return (
                <div key={ticket.ticketNumber} className="window-card" style={{ 
                  borderTop: `8px solid ${settings.primary_color}`, 
                  padding: '15px' 
                }}>
                  
                  {/* TICKET NUMBER */}
                  <h1 className="window-ticket" style={{ 
                    color: settings.primary_color, 
                    textShadow: `0 0 15px ${settings.primary_color}80`,
                    fontSize: '3.5rem', 
                    margin: '0 0 5px 0', 
                    lineHeight: '1'
                  }}>
                    {ticket.ticketNumber}
                  </h1>

                  {/* COUNTER LOCATION UNDERNEATH */}
                  <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '5px', width: '100%' }}>
                     <h3 style={{ color: 'rgba(255,255,255,0.7)', margin: '0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                       Proceed To:
                     </h3>
                     <h2 className="window-title" style={{ 
                       fontSize: '1.4rem', 
                       color: 'white', 
                       margin: '2px 0 0 0' 
                     }}>
                       {windowName}
                     </h2>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Display;