// backend/routes/equipment.js
const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

// -------------------- LENDER ROUTES --------------------

// Get all equipment of a lender
router.get('/my-equipment', auth(['Lender']), async (req, res) => {
    try {
        const equipment = await Equipment.find({ lender: req.user.id });
        res.json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch equipment" });
    }
});

// Add new equipment
router.post('/', auth(['Lender']), async (req, res) => {
    try {
        const { name, category, description, pricePerDay, condition, location, images } = req.body;

        const formattedImages = Array.isArray(images)
            ? images
            : typeof images === 'string' && images.includes(',')
            ? images.split(',').map(i => i.trim())
            : images
            ? [images]
            : [];

        const newEquipment = new Equipment({
            name,
            category,
            description,
            pricePerDay,
            condition,
            location,
            images: formattedImages,
            lender: req.user.id,
            status: 'Available', // default status
        });

        await newEquipment.save();
        res.json({ message: "Equipment added successfully", equipment: newEquipment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add equipment" });
    }
});

// Update equipment
router.put('/:id', auth(['Lender']), async (req, res) => {
    try {
        const { name, category, description, pricePerDay, condition, location, status, images } = req.body;

        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ message: "Equipment not found" });
        if (equipment.lender.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

        equipment.name = name ?? equipment.name;
        equipment.category = category ?? equipment.category;
        equipment.description = description ?? equipment.description;
        equipment.pricePerDay = pricePerDay ?? equipment.pricePerDay;
        equipment.condition = condition ?? equipment.condition;
        equipment.location = location ?? equipment.location;
        equipment.status = status ?? equipment.status;
        if (images) {
            equipment.images = Array.isArray(images)
                ? images
                : images.split(',').map(i => i.trim());
        }

        await equipment.save();
        res.json({ message: "Equipment updated successfully", equipment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update equipment" });
    }
});

// Delete equipment
router.delete('/:id', auth(['Lender']), async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ message: "Equipment not found" });
        if (equipment.lender.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

        await equipment.deleteOne();
        res.json({ message: "Equipment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete equipment" });
    }
});

// -------------------- BORROWER ROUTE --------------------

// Get all available equipment for borrowers
router.get('/', async (req, res) => {
    try {
        const equipment = await Equipment.find({ status: 'Available' })
            .populate('lender', 'fullName email phone'); // Include lender info
        res.json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch equipment" });
    }
});

module.exports = router;
