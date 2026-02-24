import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [counter, setCounter] = useState(1);

  const callNext = async () => {
    try {
      const res = await axios.put('http://localhost:5001/api/tickets/call-next', { counter });
      alert(`Calling next student to Counter ${counter}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error calling ticket");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Staff Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>Select Your Counter: </label>
        <input 
          type="number" 
          value={counter} 
          onChange={(e) => setCounter(e.target.value)}
          style={{ width: '50px', padding: '5px' }}
        />
      </div>
      <button onClick={callNext} style={adminBtnStyle}>CALL NEXT STUDENT</button>
    </div>
  );
}

const adminBtnStyle = { 
  padding: '30px 60px', 
  fontSize: '24px', 
  fontWeight: 'bold', 
  backgroundColor: '#dc3545', 
  color: 'white', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer' 
};

export default Admin;