import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Display.css';

function Display() {
  const [activeCounters, setActiveCounters] = useState([]);

  useEffect(() => {
    const fetchServing = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tickets/serving');
        const tickets = res.data;
        
        // LOGIC: We only want the LATEST ticket for each unique counter.
        // Since the backend returns them ordered by newest first (DESC), 
        // the first time we see a counter, it's their current ticket!
        const uniqueCounters = {};
        tickets.forEach(ticket => {
          if (!uniqueCounters[ticket.counter]) {
            uniqueCounters[ticket.counter] = ticket;
          }
        });

        // Convert the object back to an array and sort them by Counter number (1, 2, 3...)
        const sortedCounters = Object.values(uniqueCounters).sort((a, b) => a.counter - b.counter);
        
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
    <div className="display-container">
      
      {/* HEADER: Logo, Video, Blank */}
      <div className="display-header">
        <div className="header-box">
          <h2 style={{ color: 'gray' }}>[ Logo Area ]</h2>
        </div>
        
        <div className="header-video">
          <video autoPlay muted loop playsInline>
            {/* Make sure the video name matches your file in the public folder! */}
            <source src={`${process.env.PUBLIC_URL}/school-video.mp4`} type="video/mp4" />
          </video>
        </div>
        
        <div className="header-box">
          <h2 style={{ color: 'gray' }}>[ Blank Area ]</h2>
        </div>
      </div>

      {/* MAIN BODY: The Auto-Scaling Grid */}
      <div className="display-body">
        {activeCounters.length === 0 ? (
          <h1 style={{ textAlign: 'center', color: 'gray', fontSize: '3rem' }}>Waiting for tickets...</h1>
        ) : (
          <div className="windows-grid">
            {activeCounters.map(ticket => (
              <div key={ticket.counter} className="window-card">
                <h2 className="window-title">Counter {ticket.counter}</h2>
                <h1 className="window-ticket">{ticket.ticketNumber}</h1>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Display;