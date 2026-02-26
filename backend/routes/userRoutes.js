const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users (excluding passwords for security)
router.get('/', (req, res) => {
  const sql = "SELECT id, username, role, service_type, createdAt FROM users ORDER BY createdAt DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE an existing employee
router.put('/:id', (req, res) => {
  const { username, password, role, department } = req.body;
  const userId = req.params.id;

  // If the admin typed a new password, update everything including the password
  if (password && password.trim() !== '') {
    const sql = "UPDATE users SET username = ?, password = ?, role = ?, department = ? WHERE id = ?";
    db.query(sql, [username, password, role, department, userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Employee updated successfully!" });
    });
  } else {
    // If password field is left blank, update everything EXCEPT the password
    const sql = "UPDATE users SET username = ?, role = ?, department = ? WHERE id = ?";
    db.query(sql, [username, role, department, userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Employee updated successfully!" });
    });
  }
});

// DELETE a user
router.delete('/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;