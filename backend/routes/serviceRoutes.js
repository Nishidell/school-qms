const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all services
router.get('/', (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ADD a new service (Admin only)
router.post('/', (req, res) => {
  // NEW: Added counter_name to the request body
  const { service_name, prefix, counter_name } = req.body;
  
  // NEW: Update SQL to insert the custom counter name
  const sql = "INSERT INTO services (service_name, prefix, counter_name) VALUES (?, ?, ?)";
  
  // If they leave it blank, it defaults to 'Window 1'
  db.query(sql, [service_name, prefix, counter_name || 'Window 1'], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Service added!" });
  });
});

// DELETE a service
router.delete('/:id', (req, res) => {
  db.query("DELETE FROM services WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Service deleted" });
  });
});

module.exports = router;