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

// DELETE a user
router.delete('/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;