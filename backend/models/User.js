// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ['Borrower', 'Lender', 'Publisher', 'Admin'], required: true },
    farmSize: { type: String }, // Borrower only
    cropType: { type: String }, // Borrower only
    expertise: { type: String }, // Publisher only
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
