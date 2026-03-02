import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import './Display.css';

function Display() {
  const [activeCounters, setActiveCounters] = useState([]);
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

    // Fetch Services list
    axios.get('/api/services').then(res => {
      if (res.data) setServices(res.data);
    }).catch(err => console.error(err));

    const fetchServing = async () => {
      try {
        const res = await axios.get('/api/tickets/serving');
        const tickets = res.data;
        
        const uniqueCounters = {};
        
        tickets.forEach(ticket => {
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
    <div className="display-container" style={{ backgroundColor: settings.secondary_color, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* =========================================
          1. HEADER SECTION (Exactly 45% Height)
          ========================================= */}
      <div className="display-header" style={{ height: '45%', display: 'flex', width: '100%', padding: '15px 20px 0 20px', boxSizing: 'border-box', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        
        {/* 1. LOGO & CONTACT INFO (Left) */}
        <div className="header-box" style={{ flex: 1, backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '30px' }}>
          
          {/* LOGO: Now Left-Aligned to match the text perfectly */}
          <div style={{ height: '130px', marginBottom: '15px' }}>
            {settings.logo_path ? (
              <img src={settings.logo_path} alt="School Logo" style={{ height: '100%', objectFit: 'contain' }}/>
            ) : (
              <h2 style={{ color: 'white', margin: '0' }}>[ Logo Area ]</h2>
            )}
          </div>
          
          {/* CONTACT INFO: Clean spacing, fixed line-heights, manual address break */}
          <div style={{ color: 'white', fontSize: '0.9rem', opacity: 0.95, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaPhoneAlt size={14} color={settings.primary_color} style={{ flexShrink: 0 }} /> 
              <span style={{ fontWeight: '500', letterSpacing: '0.5px' }}>+63917 137 9827</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <FaMapMarkerAlt size={16} color={settings.primary_color} style={{ marginTop: '2px', flexShrink: 0 }} /> 
              <span style={{ lineHeight: '1.4', letterSpacing: '0.5px' }}>
                664 Electron Bldg. Quirino Highway,<br/>Bagbag, Novaliches Quezon City
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <FaFacebook size={16} color={settings.primary_color} style={{ marginTop: '2px', flexShrink: 0 }} /> 
              <span style={{ lineHeight: '1.4', letterSpacing: '0.5px' }}>
                Electron College of Technical Education
              </span>
            </div>

          </div>
        </div>
        
        {/* VIDEO (Center) */}
        <div className="header-video" style={{ flex: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px', height: '100%' }}>
          <video key={settings.video_path} autoPlay muted loop playsInline style={{ width: '100%', maxHeight: '100%', objectFit: 'contain',  borderRadius: '15px', filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.4))' }}>
            <source 
              src={settings.video_path || `${process.env.PUBLIC_URL}/school-video.mp4`} 
              type="video/mp4" 
            />
          </video>
        </div>
        
        {/* CAMPUS BRANCH & TIME (Right) */}
        <div className="header-box" style={{ flex: 1, backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: settings.primary_color, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Main Campus
          </h2>
          <h1 style={{ fontSize: '4.8rem', margin: '0', color: 'white', textShadow: `0 0 15px ${settings.primary_color}80`, fontWeight: 'bold', lineHeight: '1', whiteSpace: 'nowrap' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <h3 style={{ fontSize: '1.8rem', margin: '10px 0 0 0', color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' })}
          </h3>
        </div>
      </div>


      {/* =========================================
          2. MARQUEE SECTION
          ========================================= */}
      <div style={{ 
        height: '5%', 
        width: '100%', 
        backgroundColor: settings.primary_color, 
        color: settings.secondary_color, 
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.2rem', 
        fontWeight: 'bold', 
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: `5px solid ${settings.primary_color}`, 
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        zIndex: 10
      }}>
        <marquee scrollamount="10" style={{ width: '100%' }}>
          For more details and updates, please visit our official website at electroncollege.edu.ph and our Facebook page, Electron College of Technical Education.
        </marquee>
      </div>


      {/* =========================================
          3. BODY SECTION (Exactly 50% Height)
          ========================================= */}
      <div className="display-body" style={{ height: '50%', padding: '10px 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
        
        {/* NOW SERVING BAR */}
        <div style={{ 
          width: '100%', 
          textAlign: 'center', 
          padding: '1px 0', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          marginBottom: '2px', 
          borderBottom: `2px solid ${settings.primary_color}40`,
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: settings.primary_color, 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '5px',
            textShadow: `0 0 15px ${settings.primary_color}60`,
            lineHeight: '0.7'
          }}>
            Now Serving
          </h1>
        </div>

       {/* TICKETS GRID */}
        {activeCounters.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ textAlign: 'center', color: 'white', opacity: 0.5, fontSize: '3rem' }}>Waiting for tickets...</h1>
          </div>
        ) : (
          <div className="windows-grid" style={{ flex: 1 }}>
            {activeCounters.slice(0, 8).map(ticket => {
              
              const rawDepartment = ticket.service_type || ticket.serviceType || ticket.service || ticket.department || 'Unknown';
              const departmentName = String(rawDepartment);
              const serviceInfo = services.find(s => 
                String(s.service_name).toLowerCase().trim() === departmentName.toLowerCase().trim()
              );
              const windowName = serviceInfo && serviceInfo.counter_name ? serviceInfo.counter_name : departmentName;

              return (
                <div key={ticket.ticketNumber} className="window-card" style={{ 
                  borderTop: `5px solid ${settings.primary_color}` 
                }}>
                  
                  {/* TICKET NUMBER */}
                  <h1 className="window-ticket" style={{ 
                    color: settings.primary_color, 
                    textShadow: `0 0 15px ${settings.primary_color}80`
                  }}>
                    {ticket.ticketNumber}
                  </h1>

                  {/* COUNTER LOCATION UNDERNEATH */}
                  <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '8px', width: '100%' }}>
                     <h3 style={{ color: 'rgba(255,255,255,0.7)', margin: '0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                       Proceed To:
                     </h3>
                     <h2 className="window-title" style={{ color: 'white' }}>
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