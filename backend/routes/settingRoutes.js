const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to upload straight to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-qms-assets',
    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }], // Adds automatic optimization
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov']
  },
});
const upload = multer({ storage });

// GET Current Settings
router.get('/', (req, res) => {
  db.query("SELECT * FROM settings WHERE id = 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// UPDATE Colors
router.put('/colors', (req, res) => {
  const { primary_color, secondary_color } = req.body;
  const sql = "UPDATE settings SET primary_color = ?, secondary_color = ? WHERE id = 1";
  
  db.query(sql, [primary_color, secondary_color], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Colors updated successfully!" });
  });
});

// UPLOAD Logo (With Error Trap!)
router.post('/upload-logo', (req, res) => {
  
  // This wrapper catches Cloudinary errors before the server crashes
  upload.single('logo')(req, res, function (err) {
    if (err) {
      console.log("\n🚨🚨🚨 CLOUDINARY CRASH DETECTED 🚨🚨🚨");
      console.log(err); // Prints the exact reason to the backend terminal
      console.log("🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n");
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }

    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // If it gets here, Cloudinary worked!
    const logoUrl = req.file.path; 
    const sql = "UPDATE settings SET logo_path = ? WHERE id = 1";

    db.query(sql, [logoUrl], (dbErr, result) => {
      if (dbErr) return res.status(500).json({ error: dbErr.message });
      res.json({ message: "Logo uploaded!", logo_path: logoUrl });
    });
  });
});

// UPLOAD Video
router.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No video uploaded" });

  const videoUrl = req.file.path; // Cloudinary permanent URL
  const sql = "UPDATE settings SET video_path = ? WHERE id = 1";

  db.query(sql, [videoUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Video uploaded!", video_path: videoUrl });
  });
});

// --- CAROUSEL ROUTES ---

router.get('/carousel', (req, res) => {
  db.query("SELECT * FROM carousel_images ORDER BY uploaded_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/upload-carousel', upload.single('carousel_image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const imageUrl = req.file.path;
  db.query("INSERT INTO carousel_images (image_path) VALUES (?)", [imageUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Carousel image added!", image_path: imageUrl });
  });
});

router.delete('/carousel/:id', (req, res) => {
  db.query("DELETE FROM carousel_images WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Image removed from carousel" });
  });
});

module.exports = router;