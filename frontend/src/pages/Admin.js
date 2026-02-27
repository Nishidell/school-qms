import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaTrash } from 'react-icons/fa';
import { FaBuilding, FaUsers, FaSignOutAlt, FaUserShield, FaCog, FaPalette, FaVideo } from 'react-icons/fa';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('operations');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [editingId, setEditingId] = useState(null); // Tracks which service is being edited
  const [counterOptions, setCounterOptions] = useState([
  "Window 1", "Window 2", "Window 3", "Window 4", "Window 5", "Window 6"
]);

  // States
  const [services, setServices] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrefix, setNewPrefix] = useState('');
  const [newCounterName, setNewCounterName] = useState('');
  
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('employee');
  const [newServiceType, setNewServiceType] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  // Superadmin Settings States
  const [primaryColor, setPrimaryColor] = useState('#B31B1B');
  const [secondaryColor, setSecondaryColor] = useState('#002366');
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [carouselImages, setCarouselImages] = useState([]);
  const [newCarouselFile, setNewCarouselFile] = useState(null);

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
    fetchCarousel();
    fetchSettings();
  }, [navigate]);

  // --- API CALLS ---
  const fetchServices = async () => {
    const res = await axios.get('/api/services');
    setServices(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('/api/users');
    setUsers(res.data);
  };

  const fetchSettings = async () => {
    const res = await axios.get('/api/settings');
    if(res.data) {
      setPrimaryColor(res.data.primary_color);
      setSecondaryColor(res.data.secondary_color);
    }
  };

  const fetchCarousel = async () => {
  const res = await axios.get('/api/settings/carousel');
  setCarouselImages(res.data);
};

  const handleUploadCarousel = async (e) => {
    e.preventDefault();
    if (!newCarouselFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('carousel_image', newCarouselFile);
    try {
      await axios.post('/api/settings/upload-carousel', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setNewCarouselFile(null);
      fetchCarousel();
      alert("Image added to login carousel!");
    } catch (err) { console.error(err); }
  };

  const deleteCarouselImage = async (id) => {
    if(window.confirm("Remove this image from the slideshow?")) {
      await axios.delete(`/api/settings/carousel/${id}`);
      fetchCarousel();
    }
  };
  // --- SETTINGS LOGIC (SUPERADMIN) ---
  const handleUpdateColors = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings/colors', { primary_color: primaryColor, secondary_color: secondaryColor });
      alert("Colors updated successfully! (Refresh Kiosk/Display to see changes)");
    } catch (err) { console.error(err); }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file first");

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      await axios.post('/api/settings/upload-video', formData, {
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
    await axios.post('/api/settings/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Logo uploaded successfully! (Refresh Display to see changes)");
    setLogoFile(null);
  } catch (err) { console.error(err); }
};

  // --- DEPARTMENT & USER LOGIC ---
 const handleSaveService = async (e) => {
  e.preventDefault();
  const payload = { service_name: newName, prefix: newPrefix, counter_name: newCounterName };

  if (editingId) {
    // UPDATE existing
    await axios.put(`/api/services/${editingId}`, payload);
    setEditingId(null);
  } else {
    // ADD new
    await axios.post('/api/services', payload);
  }

  setNewName(''); setNewPrefix(''); setNewCounterName('');
  fetchServices();
};

const startEdit = (service) => {
  setEditingId(service.id);
  setNewName(service.service_name);
  setNewPrefix(service.prefix);
  setNewCounterName(service.counter_name);
};

  const handleAddUser = async (e) => {
    e.preventDefault();
    const payload = { 
      username: newUsername, 
      password: newPassword, 
      role: newRole, 
      service_type: newServiceType || 'all' // Matches your database column
    };

    try {
      if (editingUserId) {
        // UPDATE existing user
        await axios.put(`/api/users/${editingUserId}`, payload);
        alert("Employee updated successfully!");
        setEditingUserId(null); // Exit edit mode
      } else {
        // CREATE new user
        await axios.post('/api/auth/register', payload);
        alert("Account created successfully!");
      }

      // Clear the form fields
      setNewUsername(''); 
      setNewPassword(''); 
      setNewRole('employee');
      setNewServiceType('');
      fetchUsers();
    } catch (err) { 
      alert("Error saving user: " + (err.response?.data?.error || "Unknown error")); 
    }
  };

  // NEW: Function to populate the form when "Update" is clicked
  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setNewUsername(user.username);
    setNewPassword(''); // Leave blank so we don't accidentally overwrite it
    setNewRole(user.role);
    setNewServiceType(user.service_type === 'all' ? '' : user.service_type);
  };

  const handleAddNewWindow = () => {
  const newWindowName = prompt("Enter the name for the new window (e.g., Window 7):");
  
  if (newWindowName && newWindowName.trim() !== "") {
    // Check if it already exists to prevent duplicates
    if (counterOptions.includes(newWindowName)) {
      alert("This window name already exists!");
    } else {
      setCounterOptions([...counterOptions, newWindowName]);
      setNewCounterName(newWindowName); // Automatically select the new window
    }
  }
};

  const handleRemoveWindow = () => {
    if (!newCounterName) return; // Do nothing if nothing is selected
    
    const confirmDelete = window.confirm(`Are you sure you want to remove "${newCounterName}" from the dropdown options?`);
    
    if (confirmDelete) {
      // Filter out the window we want to delete
      setCounterOptions(counterOptions.filter(opt => opt !== newCounterName));
      setNewCounterName(''); // Reset the dropdown to blank
    }
  };

  const deleteService = async (id) => { if(window.confirm("Delete?")) { await axios.delete(`/api/services/${id}`); fetchServices(); } };
  const deleteUser = async (id) => { if(window.confirm("Delete?")) { await axios.delete(`/api/users/${id}`); fetchUsers(); } };

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
                     await axios.delete('/api/tickets/reset');
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
      <form onSubmit={handleSaveService} className="admin-form">
        <input className="admin-input" placeholder="Service Name" value={newName} onChange={e => setNewName(e.target.value)} required />
        <input className="admin-input" placeholder="Prefix" value={newPrefix} onChange={e => setNewPrefix(e.target.value)} required />
        
        {/* DROPDOWN FOR COUNTER NAME */}
        {/* DROPDOWN WRAPPER WITH DELETE BUTTON */}
<div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
  
  <select 
    className="admin-input" 
    value={newCounterName} 
    onChange={(e) => {
      if (e.target.value === "ADD_NEW") {
        handleAddNewWindow();
      } else {
        setNewCounterName(e.target.value);
      }
    }} 
    required
    style={{ margin: 0 }} /* Keeps it aligned with the button */
  >
    <option value="">-- Select Counter --</option>
    {counterOptions.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
    <option value="ADD_NEW" style={{ fontWeight: 'bold', color: primaryColor || '#3498db' }}>
      + Add Another Window
    </option>
  </select>

  {/* ONLY SHOW TRASH CAN IF A VALID WINDOW IS SELECTED */}
  {newCounterName && newCounterName !== "ADD_NEW" && (
    <button 
      type="button" 
      onClick={handleRemoveWindow}
      style={{ 
        backgroundColor: '#e74c3c', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        padding: '10px 12px', 
        cursor: 'pointer',
        fontSize: '1rem'
      }}
      title="Remove this window from the list"
    >
      <FaTrash />
    </button>
  )}
  
</div>

        <button type="submit" className="admin-btn-primary" style={{ backgroundColor: editingId ? '#27ae60' : primaryColor }}>
          {editingId ? 'Update Department' : 'Add Department'}
        </button>
        {editingId && <button onClick={() => {setEditingId(null); setNewName(''); setNewPrefix(''); setNewCounterName('');}} className="admin-btn-cancel">Cancel</button>}
      </form>
    </div>

    <table className="admin-table">
      <thead>
        <tr><th>Service Name</th><th>Prefix</th><th>Assigned Counter</th><th>Action</th></tr>
      </thead>
      <tbody>
        {services.map(s => (
          <tr key={s.id}>
            <td>{s.service_name}</td>
            <td><strong>{s.prefix}</strong></td>
            <td>{s.counter_name}</td>
            <td style={{ display: 'flex', gap: '10px' }}>
              <button className="admin-btn-edit" onClick={() => startEdit(s)} style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
              <button className="btn-danger" onClick={() => deleteService(s.id)}>Remove</button>
            </td>
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
              <form onSubmit={handleAddUser} className="admin-form">
                <input className="admin-input" placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                
                {/* Password is only required if making a NEW account */}
                <input className="admin-input" type="password" placeholder={editingUserId ? "New Password" : "Password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} required={!editingUserId} />
                
                <select className="admin-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  {/* ONLY SUPERADMIN CAN CREATE ADMINS */}
                  {currentUser?.role === 'superadmin' && <option value="admin">Admin</option>}
                </select>

                {newRole === 'employee' && (
                  <select className="admin-select" value={newServiceType} onChange={e => setNewServiceType(e.target.value)} required>
                    <option value="">Department</option>
                    {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name}</option>)}
                  </select>
                )}

                <button type="submit" className="admin-btn-primary" style={{ backgroundColor: editingUserId ? '#27ae60' : primaryColor }}>
                  {editingUserId ? 'Update Employee' : 'Create Account'}
                </button>

                {/* CANCEL BUTTON */}
                {editingUserId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingUserId(null); 
                      setNewUsername(''); 
                      setNewPassword(''); 
                      setNewRole('employee'); 
                      setNewServiceType('');
                    }} 
                    className="admin-btn-cancel"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
            
            <table className="admin-table">
              <thead><tr><th>Username</th><th>Role</th><th>Department</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                    <td>{u.service_type}</td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      
                      {/* NEW UPDATE BUTTON */}
                      <button 
                        className="admin-btn-edit" 
                        onClick={() => startEditUser(u)} 
                        style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Update
                      </button>

                      <button className="btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
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

          <div className="admin-card" style={{ borderTop: `5px solid ${primaryColor}` }}>
           <h3>📸 Login Page Slideshow</h3>
           <p style={{ color: 'gray' }}>Upload images for the login screen carousel.</p>

           <form onSubmit={handleUploadCarousel} className="admin-form" style={{ marginTop: '20px', marginBottom: '20px' }}>
             <input type="file" accept="image/png, image/jpeg" onChange={e => setNewCarouselFile(e.target.files[0])} className="admin-input" />
             <button type="submit" className="admin-btn-primary" style={{ backgroundColor: primaryColor }}>Add to Slideshow</button>
           </form>

           {/* Show the uploaded images */}
           <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
             {carouselImages.map(img => (
               <div key={img.id} style={{ position: 'relative', minWidth: '150px' }}>
                 <img src={`/uploads/${img.image_path}`} alt="Carousel" style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                 <button onClick={() => deleteCarouselImage(img.id)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>X</button>
               </div>
             ))}
           </div>
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