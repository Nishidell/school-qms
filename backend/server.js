const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the database connection
require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Tell the server to use our MySQL routes
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.send('School Queueing System API is running on XAMPP MySQL...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});