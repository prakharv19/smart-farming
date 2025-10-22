const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Publisher', 'Borrower', 'Lender'], required: true },
    title: { type: String, required: true },         // Short title of complaint
    message: { type: String, required: true },       // Detailed description
    image: { type: String },                         // Optional image URL
    status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
    adminComment: { type: String, default: '' },     // Admin remarks
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);
