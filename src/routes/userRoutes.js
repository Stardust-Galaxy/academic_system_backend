// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Auth routes (public)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/reset-password', userController.resetPassword);
router.post('/verify-password', userController.verifyPassword);
// Protected route example
router.get('/profile', auth, (req, res) => {
    res.json({ userData: req.userData });
});

module.exports = router;