// backend/models/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: [
        'Tractors',
        'Harvesters',
        'Ploughs',
        'Seeders',
        'Sprayers',
        'Irrigation Equipment',
        'Soil Preparation Tools',
        'Fertilizer Spreaders',
        'Threshers',
        'Transport Vehicles',
        'Other'
      ],
      required: true,
    },

    description: { type: String },

    pricePerDay: { type: Number, required: true },

    condition: {
      type: String,
      enum: ['New', 'Good', 'Fair', 'Old'],
      default: 'Good',
    },

    location: { type: String },

    status: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available',
    },

    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
