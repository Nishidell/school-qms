import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [services, setServices] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrefix, setNewPrefix] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5001/api/services');
    setServices(res.data);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5001/api/services', { 
      service_name: newName, 
      prefix: newPrefix 
    });
    setNewName(''); setNewPrefix('');
    fetchServices();
  };

  const deleteService = async (id) => {
    if(window.confirm("Are you sure?")) {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      fetchServices();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2>Admin Panel</h2>
        <p>Manage Services</p>
        <p>Manage Employees</p>
        <p>Reports</p>
        <button onClick={() => {localStorage.clear(); window.location.href='/login'}}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
        <h1>Department Management</h1>
        
        {/* Form to add service */}
        <div style={cardStyle}>
          <h3>Add New Department</h3>
          <form onSubmit={handleAddService}>
            <input placeholder="Service Name (e.g. Clinic)" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} required />
            <input placeholder="Prefix (e.g. M)" value={newPrefix} onChange={e => setNewPrefix(e.target.value)} style={inputStyle} required />
            <button type="submit" style={btnStyle}>Add Department</button>
          </form>
        </div>

        {/* List of services */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#fff' }}>
              <th>Service Name</th>
              <th>Prefix</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.service_name}</td>
                <td><strong>{s.prefix}</strong></td>
                <td><button onClick={() => deleteService(s.id)} style={{color: 'red'}}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' };
const inputStyle = { padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' };

export default Admin;