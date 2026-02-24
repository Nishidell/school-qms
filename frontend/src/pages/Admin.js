import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('departments');
  const navigate = useNavigate();

  // State for Services (Departments)
  const [services, setServices] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrefix, setNewPrefix] = useState('');

  // State for Employees
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('employee');
  const [newServiceType, setNewServiceType] = useState('');

  useEffect(() => {
    fetchServices();
    fetchUsers();
  }, []);

  // --- API CALLS ---
  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5001/api/services');
    setServices(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5001/api/users');
    setUsers(res.data);
  };

  // --- DEPARTMENT LOGIC ---
  const handleAddService = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5001/api/services', { service_name: newName, prefix: newPrefix });
    setNewName(''); setNewPrefix('');
    fetchServices();
  };

  const deleteService = async (id) => {
    if(window.confirm("Delete this department?")) {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      fetchServices();
    }
  };

  // --- EMPLOYEE LOGIC ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/register', { 
        username: newUsername, 
        password: newPassword,
        role: newRole,
        service_type: newServiceType || 'all'
      });
      alert("Account created successfully!");
      setNewUsername(''); setNewPassword(''); fetchUsers();
    } catch (err) {
      alert("Error creating user: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm("Delete this user account?")) {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      fetchUsers();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2>🏫 Admin Panel</h2>
        <button className={`sidebar-btn ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>
          🏢 Manage Departments
        </button>
        <button className={`sidebar-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
          👥 Manage Employees
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main">
        
        {/* === DEPARTMENTS TAB === */}
        {activeTab === 'departments' && (
          <div>
            <h1>Department Management</h1>
            <div className="admin-card">
              <h3>Add New Department</h3>
              <form onSubmit={handleAddService} className="admin-form">
                <input className="admin-input" placeholder="Service Name (e.g. Clinic)" value={newName} onChange={e => setNewName(e.target.value)} required />
                <input className="admin-input" placeholder="Prefix (e.g. M)" value={newPrefix} onChange={e => setNewPrefix(e.target.value)} required />
                <button type="submit" className="admin-btn-primary">Add Department</button>
              </form>
            </div>

            <table className="admin-table">
              <thead><tr><th>Service Name</th><th>Prefix</th><th>Action</th></tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td>{s.service_name}</td><td><strong>{s.prefix}</strong></td>
                    <td><button className="btn-danger" onClick={() => deleteService(s.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === EMPLOYEES TAB === */}
        {activeTab === 'employees' && (
          <div>
            <h1>Employee Management</h1>
            <div className="admin-card">
              <h3>Create Staff Account</h3>
              <form onSubmit={handleAddUser} className="admin-form">
                <input className="admin-input" placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                <input className="admin-input" type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                
                <select className="admin-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>

                {newRole === 'employee' && (
                  <select className="admin-select" value={newServiceType} onChange={e => setNewServiceType(e.target.value)} required>
                    <option value="">-- Assign Department --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.service_name}>{s.service_name}</option>
                    ))}
                  </select>
                )}
                
                <button type="submit" className="admin-btn-primary">Create Account</button>
              </form>
            </div>

            <table className="admin-table">
              <thead><tr><th>Username</th><th>Role</th><th>Department</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td><span style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                    <td>{u.service_type === 'all' ? 'All Access' : u.service_type}</td>
                    <td><button className="btn-danger" onClick={() => deleteUser(u.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;