const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// REGISTER A NEW USER (Use this once to create your Admin)
router.post('/register', async (req, res) => {
  const { username, password, role, service_type } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, role, service_type) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [username, hashedPassword, role, service_type], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User created successfully!" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    // Create a Token that expires in 1 day
    const token = jwt.sign(
      { id: user.id, role: user.role, service_type: user.service_type },
      'your_jwt_secret', // In a real app, put this in .env
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, username: user.username });
  });
});

module.exports = router;