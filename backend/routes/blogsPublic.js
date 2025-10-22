// backend/routes/blogsPublic.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all approved blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Approved' })
      .select('title excerpt category image createdAt publisher') // fields to return
      .populate('publisher', 'fullName'); // show publisher name
    res.json(blogs);
  } catch (err) {
    console.error('Public blogs error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single approved blog by id (public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: 'Approved' }).populate('publisher', 'fullName email');
    if (!blog) return res.status(404).json({ message: 'Blog not found or not approved' });
    res.json(blog);
  } catch (err) {
    console.error('Public blog detail error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
