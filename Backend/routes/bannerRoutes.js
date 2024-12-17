const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Banner = require('../models/Banner');

const router = express.Router();

// Serve static files from the bannerfolder directory
router.use('/bannerfolder', express.static(path.join(__dirname, '../bannerfolder')));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../bannerfolder');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Upload a banner
router.post('/upload-banner', upload.single('image'), async (req, res) => {
  try {
    const { name, detailsName, serviceName, addressName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imagePath = `/bannerfolder/${req.file.filename}`;
    const banner = new Banner({
      name,
      detailsName,
      serviceName,
      addressName,
      image: imagePath,
    });

    await banner.save();
    res.status(201).json({ message: 'Banner uploaded successfully', banner });
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ message: 'Error uploading banner', error });
  }
});

// Get all banners
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Error fetching banners', error });
  }
});


// Delete a banner by ID
router.delete('/delete-banner/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const imagePath = path.join(__dirname, `../${banner.image}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Error deleting banner', error });
  }
});


module.exports = router;
