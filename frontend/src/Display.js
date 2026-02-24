import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Display() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:5001/api/tickets')
        .then(res => setTickets(res.data))
        .catch(err => console.error(err));
    }, 3000); // Automatically refreshes every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '50px', backgroundColor: '#282c34', color: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '50px' }}>NOW SERVING</h1>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {tickets.slice(0, 6).map(ticket => (
          <div key={ticket.id} style={{ border: '2px solid white', padding: '20px', borderRadius: '15px' }}>
            <h2 style={{ fontSize: '80px', margin: '0' }}>{ticket.ticketNumber}</h2>
            <p style={{ fontSize: '20px' }}>{ticket.serviceType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;