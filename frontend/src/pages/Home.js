import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDesktop, FaTv, FaUserShield } from 'react-icons/fa';
import './Home.css'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* The new animated background layer */}
      <div className="home-bg"></div> 
      <div className="home-overlay"></div> 
      
      <div className="home-card">
        <h1 className="home-title">Queueing Management System</h1>
        <p className="home-subtitle">Electron College of Technical Education</p>

        <button 
          className="home-btn btn-kiosk" 
          onClick={() => navigate('/kiosk')}
        >
          <FaDesktop size={24} /> Launch Kiosk (Front Door)
        </button>

        <button 
          className="home-btn btn-display" 
          onClick={() => navigate('/display')}
        >
          <FaTv size={24} /> Launch TV Display (Waiting Area)
        </button>

        <button 
          className="home-btn btn-portal" 
          onClick={() => navigate('/login')}
        >
          <FaUserShield size={24} /> Staff & Admin Portal
        </button>
      </div>
    </div>
  );
}

export default Home;