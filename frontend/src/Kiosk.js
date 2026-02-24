import React from 'react';
import axios from 'axios';

function Kiosk() {
  const generateTicket = async (type) => {
    try {
      const res = await axios.post('http://localhost:5001/api/tickets', { serviceType: type });
      alert(`Your Ticket Number is: ${res.data.ticketNumber}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to School Services</h1>
      <p>Please select a service to get your ticket:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => generateTicket('Registrar')} style={btnStyle}>Registrar</button>
        <button onClick={() => generateTicket('Cashier')} style={btnStyle}>Cashier</button>
        <button onClick={() => generateTicket('Library')} style={btnStyle}>Library</button>
      </div>
    </div>
  );
}

const btnStyle = { padding: '20px 40px', fontSize: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '10px' };

export default Kiosk;