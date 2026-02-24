import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token); 
      
      if (res.data.role === 'admin' || res.data.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/employee'); 
      }
    } catch (err) {
      alert("Login Failed: Check your credentials");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>🔐 Staff Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div>
          <label>Username:</label><br/>
          <input type="text" onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Password:</label><br/>
          <input type="password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
        </div>
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };

export default Login;