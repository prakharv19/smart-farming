const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');

/* ========================= SUBMIT COMPLAINT ========================= */
router.post('/', auth(['Publisher','Borrower','Lender']), async (req, res) => {
  try {
    const { title, message, image } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const complaint = new Complaint({
      user: req.user.id,
      role: req.user.role,
      title,
      message,
      image: image || ''
    });

    await complaint.save();
    res.json({ message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    console.error('Complaint submission error:', err);
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
});

/* ========================= GET USER COMPLAINTS ========================= */
router.get('/my-complaints', auth(['Publisher','Borrower','Lender']), async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('Fetch my complaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

/* ========================= DELETE OWN COMPLAINT ========================= */
router.delete('/cancel/:id', auth(['Publisher','Borrower','Lender']), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Ensure only the owner can delete
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Only pending complaints can be deleted
    if (complaint.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending complaints can be deleted' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('Delete complaint error:', err);
    res.status(500).json({ message: 'Failed to delete complaint', error: err.message });
  }
});

/* ========================= ADMIN: GET ALL COMPLAINTS ========================= */
router.get('/', auth(['Admin']), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'fullName email role')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('Fetch complaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

/* ========================= ADMIN: RESOLVE / REJECT COMPLAINT ========================= */
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    if (!['Resolved','Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Resolved or Rejected' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.adminComment = adminComment || '';
    await complaint.save();

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (err) {
    console.error('Update complaint error:', err);
    res.status(500).json({ message: 'Failed to update complaint', error: err.message });
  }
});

/* ========================= ADMIN: DELETE ANY COMPLAINT ========================= */
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('Delete complaint error:', err);
    res.status(500).json({ message: 'Failed to delete complaint', error: err.message });
  }
});

module.exports = router;
