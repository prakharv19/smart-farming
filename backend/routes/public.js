const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const Blog = require('../models/Blog');

// Get all available equipment (public)
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await Equipment.find({ status: 'Available' }).sort({ createdAt: -1 });
    res.json(equipment);
  } catch (err) {
    console.error('Error fetching equipment:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get approved blogs (already done)
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Approved' })
      .populate('publisher', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
