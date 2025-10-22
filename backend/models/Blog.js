// backend/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String }, // short summary for list
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Farming Tips', 'Equipment', 'Market News', 'Finance', 'Other'],
    default: 'Other'
  },
  image: { type: String }, // optional image URL
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminComment: { type: String } // admin feedback or reason
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
