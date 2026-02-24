const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure Multer to save uploaded videos into a 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Save file as timestamp + extension (e.g., 163456789.mp4)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET Current Settings (Public - so Kiosk/Display can read it)
router.get('/', (req, res) => {
  db.query("SELECT * FROM settings WHERE id = 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// UPDATE Colors (Superadmin only)
router.put('/colors', (req, res) => {
  const { primary_color, secondary_color } = req.body;
  const sql = "UPDATE settings SET primary_color = ?, secondary_color = ? WHERE id = 1";
  
  db.query(sql, [primary_color, secondary_color], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Colors updated successfully!" });
  });
});

router.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const logoPath = req.file.filename;
  const sql = "UPDATE settings SET logo_path = ? WHERE id = 1";

  db.query(sql, [logoPath], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logo uploaded!", logo_path: logoPath });
  });
});

// UPLOAD Video (Superadmin only)
router.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No video uploaded" });

  const videoPath = req.file.filename;
  const sql = "UPDATE settings SET video_path = ? WHERE id = 1";

  db.query(sql, [videoPath], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Video uploaded!", video_path: videoPath });
  });
});

// --- CAROUSEL ROUTES ---

// GET all carousel images
router.get('/carousel', (req, res) => {
  db.query("SELECT * FROM carousel_images ORDER BY uploaded_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPLOAD a new carousel image
router.post('/upload-carousel', upload.single('carousel_image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const imagePath = req.file.filename;
  db.query("INSERT INTO carousel_images (image_path) VALUES (?)", [imagePath], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Carousel image added!", image_path: imagePath });
  });
});

// DELETE a carousel image
router.delete('/carousel/:id', (req, res) => {
  db.query("DELETE FROM carousel_images WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Image removed from carousel" });
  });
});

module.exports = router;