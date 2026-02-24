import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaBuilding, FaUsers, FaSignOutAlt, FaUserShield, FaCog, FaPalette, FaVideo } from 'react-icons/fa';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('operations');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // States
  const [services, setServices] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrefix, setNewPrefix] = useState('');
  
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('employee');
  const [newServiceType, setNewServiceType] = useState('');

  // Superadmin Settings States
  const [primaryColor, setPrimaryColor] = useState('#B31B1B');
  const [secondaryColor, setSecondaryColor] = useState('#002366');
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    
    try {
      const decoded = jwtDecode(token);
      // Kick them out if they are just an employee
      if (decoded.role === 'employee') return navigate('/login'); 
      setCurrentUser(decoded);
    } catch (err) {
      navigate('/login');
    }

    fetchServices();
    fetchUsers();
    fetchSettings();
  }, [navigate]);

  // --- API CALLS ---
  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5001/api/services');
    setServices(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5001/api/users');
    setUsers(res.data);
  };

  const fetchSettings = async () => {
    const res = await axios.get('http://localhost:5001/api/settings');
    if(res.data) {
      setPrimaryColor(res.data.primary_color);
      setSecondaryColor(res.data.secondary_color);
    }
  };

  // --- SETTINGS LOGIC (SUPERADMIN) ---
  const handleUpdateColors = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5001/api/settings/colors', { primary_color: primaryColor, secondary_color: secondaryColor });
      alert("Colors updated successfully! (Refresh Kiosk/Display to see changes)");
    } catch (err) { console.error(err); }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file first");

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      await axios.post('http://localhost:5001/api/settings/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Video uploaded successfully! (Refresh Kiosk/Display to see changes)");
      setVideoFile(null);
    } catch (err) { console.error(err); }
  };

  const handleUploadLogo = async (e) => {
  e.preventDefault();
  if (!logoFile) return alert("Please select an image file first");

  const formData = new FormData();
  formData.append('logo', logoFile);

  try {
    await axios.post('http://localhost:5001/api/settings/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Logo uploaded successfully! (Refresh Display to see changes)");
    setLogoFile(null);
  } catch (err) { console.error(err); }
};

  // --- DEPARTMENT & USER LOGIC ---
  const handleAddService = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5001/api/services', { service_name: newName, prefix: newPrefix });
    setNewName(''); setNewPrefix(''); fetchServices();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/register', { 
        username: newUsername, password: newPassword, role: newRole, service_type: newServiceType || 'all'
      });
      alert("Account created successfully!");
      setNewUsername(''); setNewPassword(''); fetchUsers();
    } catch (err) { alert("Error creating user: " + (err.response?.data?.error || "Unknown error")); }
  };

  const deleteService = async (id) => { if(window.confirm("Delete?")) { await axios.delete(`http://localhost:5001/api/services/${id}`); fetchServices(); } };
  const deleteUser = async (id) => { if(window.confirm("Delete?")) { await axios.delete(`http://localhost:5001/api/users/${id}`); fetchUsers(); } };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="admin-sidebar" style={{ backgroundColor: secondaryColor }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FaUserShield /> {currentUser?.role === 'superadmin' ? 'Superadmin' : 'Admin'}
        </h2>
        
        <button className={`sidebar-btn ${activeTab === 'operations' ? 'active' : ''}`} onClick={() => setActiveTab('operations')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⚙️ Daily Operations
        </button>
        <button className={`sidebar-btn ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBuilding /> Departments
        </button>
        <button className={`sidebar-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaUsers /> Employees
        </button>

        {/* ONLY SHOW SETTINGS TO SUPERADMIN */}
        {currentUser?.role === 'superadmin' && (
          <button className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCog /> System Settings
          </button>
        )}
        
        <button className="sidebar-btn logout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main">
        
        {activeTab === 'operations' && (
           <div>
             <h1>Daily Operations</h1>
             <div className="admin-card" style={{ borderTop: `5px solid ${primaryColor}` }}>
               <h3>End of Day Procedures</h3>
               <button onClick={async () => {
                   if(window.confirm("CRITICAL WARNING: Are you sure you want to reset the queue?")) {
                     await axios.delete('http://localhost:5001/api/tickets/reset');
                     alert("Queue reset successfully!");
                   }
                 }} 
                 className="btn-danger" style={{ padding: '15px', fontSize: '18px' }}>
                 ⚠️ RESET QUEUE FOR THE DAY
               </button>
             </div>
           </div>
        )}

        {/* === DEPARTMENTS TAB === */}
        {activeTab === 'departments' && (
          <div>
            <h1>Department Management</h1>
            <div className="admin-card">
              <form onSubmit={handleAddService} className="admin-form">
                <input className="admin-input" placeholder="Service Name" value={newName} onChange={e => setNewName(e.target.value)} required />
                <input className="admin-input" placeholder="Prefix (e.g. M)" value={newPrefix} onChange={e => setNewPrefix(e.target.value)} required />
                <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Add Department</button>
              </form>
            </div>
            <table className="admin-table">
              <thead><tr><th>Service Name</th><th>Prefix</th><th>Action</th></tr></thead>
              <tbody>
                {services.map(s => <tr key={s.id}><td>{s.service_name}</td><td><strong>{s.prefix}</strong></td><td><button className="btn-danger" onClick={() => deleteService(s.id)}>Remove</button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {/* === EMPLOYEES TAB === */}
        {activeTab === 'employees' && (
          <div>
            <h1>Employee Management</h1>
            <div className="admin-card">
              <form onSubmit={handleAddUser} className="admin-form">
                <input className="admin-input" placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                <input className="admin-input" type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                
                <select className="admin-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  {/* ONLY SUPERADMIN CAN CREATE ADMINS */}
                  {currentUser?.role === 'superadmin' && <option value="admin">Admin</option>}
                </select>

                {newRole === 'employee' && (
                  <select className="admin-select" value={newServiceType} onChange={e => setNewServiceType(e.target.value)} required>
                    <option value="">-- Assign Department --</option>
                    {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name}</option>)}
                  </select>
                )}
                <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Create Account</button>
              </form>
            </div>
            <table className="admin-table">
              <thead><tr><th>Username</th><th>Role</th><th>Department</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => <tr key={u.id}><td>{u.username}</td><td>{u.role}</td><td>{u.service_type}</td><td><button className="btn-danger" onClick={() => deleteUser(u.id)}>Delete</button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {/* === SUPERADMIN SETTINGS TAB === */}
        {activeTab === 'settings' && currentUser?.role === 'superadmin' && (
          <div>
            <h1>System Branding & Settings</h1>
            
            <div className="admin-card" style={{ borderTop: `5px solid ${primaryColor}` }}>
              <h3><FaPalette /> Theme Colors</h3>
              <form onSubmit={handleUpdateColors} className="admin-form" style={{ marginTop: '20px' }}>
                <div>
                  <label>Primary Color (Buttons, Accents): </label>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ padding: '0', height: '40px', width: '60px', border: 'none' }}/>
                </div>
                <div>
                  <label>Secondary Color (Headers, Sidebars): </label>
                  <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} style={{ padding: '0', height: '40px', width: '60px', border: 'none' }}/>
                </div>
                <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Save Colors</button>
              </form>
            </div>

            <div className="admin-card" style={{ borderTop: `5px solid ${primaryColor}` }}>
            <h3>🖼️ School Logo</h3>
            <p style={{ color: 'gray' }}>Upload a PNG or JPG logo for the Display screen.</p>
            <form onSubmit={handleUploadLogo} className="admin-form" style={{ marginTop: '20px' }}>
              <input type="file" accept="image/png, image/jpeg" onChange={e => setLogoFile(e.target.files[0])} className="admin-input" />
              <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Upload Logo</button>
            </form>
          </div>

            <div className="admin-card" style={{ borderTop: `5px solid ${secondaryColor}` }}>
              <h3><FaVideo /> Kiosk & Display Video</h3>
              <p style={{ color: 'gray' }}>Upload an MP4 file to play continuously on the public screens.</p>
              <form onSubmit={handleUploadVideo} className="admin-form" style={{ marginTop: '20px' }}>
                <input type="file" accept="video/mp4" onChange={e => setVideoFile(e.target.files[0])} className="admin-input" />
                <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Upload Video</button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;