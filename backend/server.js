const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- MOVED TO THE TOP!
require('dotenv').config();

// Initialize the database connection
require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');

app.use(cors());
app.use(express.json());

// Tell the server to use our MySQL routes
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/services', require('./routes/serviceRoutes'));

// --- CREATE UPLOADS FOLDER IF IT DOESN'T EXIST ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// Serve the uploads folder
app.use('/uploads', express.static(uploadDir));

app.use('/api/settings', require('./routes/settingRoutes'));

// --- DEPLOYMENT MERGE ---
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route: Send everything else to React
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});