const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');
const User = require('../models/User');

/* ========================= PROFILE MANAGEMENT ========================= */

// Get Publisher Profile
router.get('/profile', auth(['Publisher']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Publisher Profile
router.put('/profile', auth(['Publisher']), async (req, res) => {
  try {
    const { fullName, email, phone, address, expertise, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (expertise) user.expertise = expertise;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    const responseUser = user.toObject();
    delete responseUser.password;

    res.json({ message: 'Profile updated successfully', user: responseUser });
  } catch (err) {
    console.error('Profile update error:', err);
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

/* ========================= BLOG MANAGEMENT ========================= */

// Create a new draft blog
router.post('/', auth(['Publisher']), async (req, res) => {
  try {
    const { title, excerpt, content, category, image } = req.body;
    const blog = new Blog({
      title,
      excerpt,
      content,
      category,
      image,
      publisher: req.user.id,
      status: 'Draft',
    });
    await blog.save();
    res.status(201).json({ message: 'Draft created', blog });
  } catch (err) {
    console.error('Publisher create error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update/edit own blog (Draft or Rejected)
router.put('/:id', auth(['Publisher']), async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, publisher: req.user.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!['Draft', 'Rejected'].includes(blog.status)) {
      return res.status(400).json({ message: 'Only Draft or Rejected blogs can be edited' });
    }

    const { title, excerpt, content, category, image } = req.body;
    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (image) blog.image = image;
    blog.adminComment = undefined;

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    console.error('Publisher update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Submit for approval
router.post('/:id/submit', auth(['Publisher']), async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, publisher: req.user.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.status === 'Pending') return res.status(400).json({ message: 'Already submitted' });

    if (!blog.title || !blog.content) {
      return res.status(400).json({ message: 'Title and content required before submitting' });
    }

    blog.status = 'Pending';
    await blog.save();
    res.json({ message: 'Blog submitted for approval', blog });
  } catch (err) {
    console.error('Publisher submit error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all blogs by publisher
router.get('/my-blogs', auth(['Publisher']), async (req, res) => {
  try {
    const blogs = await Blog.find({ publisher: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Publisher my-blogs error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete blog (cannot delete Pending)
router.delete('/:id', auth(['Publisher']), async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, publisher: req.user.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found or unauthorized' });

    if (blog.status === 'Pending') {
      return res.status(400).json({ message: 'Cannot delete a blog pending approval' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Publisher delete error:', err);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

module.exports = router;
