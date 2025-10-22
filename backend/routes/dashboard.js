// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/borrower', auth(['Borrower']), (req, res) => {
    res.json({ message: "Welcome Borrower Dashboard", user: req.user });
});

router.get('/lender', auth(['Lender']), (req, res) => {
    res.json({ message: "Welcome Lender Dashboard", user: req.user });
});

router.get('/publisher', auth(['Publisher']), (req, res) => {
    res.json({ message: "Welcome Publisher Dashboard", user: req.user });
});

router.get('/admin', auth(['Admin']), (req, res) => {
    res.json({ message: "Welcome Admin Dashboard", user: req.user });
});

module.exports = router;
