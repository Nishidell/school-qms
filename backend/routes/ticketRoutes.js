const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 1. GET ALL WAITING TICKETS
router.get('/', (req, res) => {
  const dept = req.query.dept; 
  
  let sql = "SELECT * FROM tickets WHERE status = 'waiting'";
  let params = [];

  if (dept && dept !== 'all') {
    sql += " AND serviceType = ?";
    params.push(dept);
  }

  sql += " ORDER BY createdAt ASC";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. CREATE A NEW TICKET (DYNAMIC: Reads prefix directly from the Admin settings!)
router.post('/', (req, res) => {
  const { serviceType } = req.body;

  // Get the prefix from the services table
  const serviceSql = "SELECT prefix FROM services WHERE service_name = ?";
  
  db.query(serviceSql, [serviceType], (err, serviceResult) => {
    if (err || serviceResult.length === 0) return res.status(400).json({ error: "Invalid Service" });

    const prefix = serviceResult[0].prefix;

    // Count existing tickets for THIS prefix to get the next number
    const countSql = "SELECT COUNT(*) AS count FROM tickets WHERE ticketNumber LIKE ?";
    
    db.query(countSql, [`${prefix}-%`], (err, countResults) => {
      const newNumber = `${prefix}-${countResults[0].count + 1}`;

      // Insert the new ticket
      const insertSql = "INSERT INTO tickets (ticketNumber, serviceType) VALUES (?, ?)";
      db.query(insertSql, [newNumber, serviceType], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ ticketNumber: newNumber });
      });
    });
  });
});

// 3. CALL NEXT TICKET (Update status to 'serving')
router.put('/call-next', (req, res) => {
  const { counter, dept } = req.body;

  let findSql = "SELECT id, ticketNumber FROM tickets WHERE status = 'waiting' ";
  let params = [];

  if (dept && dept !== 'all') {
    findSql += "AND serviceType = ? ";
    params.push(dept);
  }

  findSql += "ORDER BY createdAt ASC LIMIT 1";

  db.query(findSql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No students waiting for your department!" });

    const ticketId = results[0].id;
    const ticketNum = results[0].ticketNumber;

    const updateSql = "UPDATE tickets SET status = 'serving', counter = ? WHERE id = ?";
    
    db.query(updateSql, [counter, ticketId], (err, updateResult) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Ticket called!", ticketId, ticketNumber: ticketNum, counter });
    });
  });
});
  
// 4. GET 'SERVING' TICKETS (For the TV Display)
router.get('/serving', (req, res) => {
  const sql = "SELECT * FROM tickets WHERE status = 'serving' ORDER BY id DESC LIMIT 6";
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 5. COMPLETE A TICKET (Employee Side)
router.put('/complete/:id', (req, res) => {
  const sql = "UPDATE tickets SET status = 'completed' WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction finished!" });
  });
});

// 6. RESET THE ENTIRE QUEUE FOR THE DAY (Admin Side)
router.delete('/reset', (req, res) => {
  const sql = "TRUNCATE TABLE tickets";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Queue has been reset for a new day!" });
  });
});

module.exports = router;