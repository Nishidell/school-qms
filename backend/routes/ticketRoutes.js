const express = require('express');
const router = express.Router();
const db = require('../db'); // This imports the XAMPP connection we just made!

// 1. GET ALL WAITING TICKETS
router.get('/', (req, res) => {
  const dept = req.query.dept; // This comes from the URL (e.g., ?dept=Registrar)
  
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

// 2. CREATE A NEW TICKET
router.post('/', (req, res) => {
  const { serviceType } = req.body;
  
  // Logic to determine prefix
  let prefix = 'G'; // Default 'General'
  if (serviceType === 'Registrar') prefix = 'R';
  if (serviceType === 'Cashier') prefix = 'C';
  if (serviceType === 'Complaints') prefix = 'X';

  // Count how many of THIS specific prefix exist today
  const countSql = "SELECT COUNT(*) AS count FROM tickets WHERE ticketNumber LIKE ?";
  
  db.query(countSql, [`${prefix}-%`], (err, countResults) => {
    const newNumber = `${prefix}-${countResults[0].count + 1}`;
    const insertSql = "INSERT INTO tickets (ticketNumber, serviceType) VALUES (?, ?)";
    
    db.query(insertSql, [newNumber, serviceType], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ ticketNumber: newNumber });
    });
  });
});

  // 3. CALL NEXT TICKET (Update status to 'serving')
router.put('/call-next', (req, res) => {
  const { counter, dept } = req.body;

  // Find the oldest waiting ticket for THIS specific department
  let findSql = "SELECT id, ticketNumber FROM tickets WHERE status = 'waiting' ";
  let params = [];

  // If they aren't 'all' (Admin), filter by their assigned department
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

    // Update that ticket to 'serving'
    const updateSql = "UPDATE tickets SET status = 'serving', counter = ? WHERE id = ?";
    
    db.query(updateSql, [counter, ticketId], (err, updateResult) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Ticket called!", ticketId, ticketNumber: ticketNum, counter });
    });
  });
});

router.post('/', (req, res) => {
  const { serviceType } = req.body;

  // 1. Get the prefix from the services table
  const serviceSql = "SELECT prefix FROM services WHERE service_name = ?";
  
  db.query(serviceSql, [serviceType], (err, serviceResult) => {
    if (err || serviceResult.length === 0) return res.status(400).json({ error: "Invalid Service" });

    const prefix = serviceResult[0].prefix;

    // 2. Count existing tickets for THIS prefix to get the next number
    const countSql = "SELECT COUNT(*) AS count FROM tickets WHERE ticketNumber LIKE ?";
    
    db.query(countSql, [`${prefix}-%`], (err, countResults) => {
      const newNumber = `${prefix}-${countResults[0].count + 1}`;

      // 3. Insert the new ticket
      const insertSql = "INSERT INTO tickets (ticketNumber, serviceType) VALUES (?, ?)";
      db.query(insertSql, [newNumber, serviceType], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ ticketNumber: newNumber });
      });
    });
  });
});
  
module.exports = router;