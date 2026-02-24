const express = require('express');
const router = express.Router();
const db = require('../db'); // This imports the XAMPP connection we just made!

// 1. GET ALL WAITING TICKETS
router.get('/', (req, res) => {
  const sql = "SELECT * FROM tickets WHERE status = 'waiting' ORDER BY createdAt ASC";
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. CREATE A NEW TICKET
router.post('/', (req, res) => {
  const serviceType = req.body.serviceType || 'General';

  // First, count how many tickets exist to make the next number (e.g., A-1, A-2)
  const countSql = "SELECT COUNT(*) AS count FROM tickets";
  
  db.query(countSql, (err, countResults) => {
    if (err) return res.status(500).json({ error: err.message });

    const totalTickets = countResults[0].count;
    const newTicketNumber = `A-${totalTickets + 1}`;

    // Now, insert the new ticket into the XAMPP database
    const insertSql = "INSERT INTO tickets (ticketNumber, serviceType) VALUES (?, ?)";
    
    db.query(insertSql, [newTicketNumber, serviceType], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: result.insertId,
        ticketNumber: newTicketNumber,
        serviceType: serviceType,
        status: 'waiting'
      });
    });
  });
});

module.exports = router;