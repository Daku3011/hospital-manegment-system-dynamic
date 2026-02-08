const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example protected route
router.get('/profile', authMiddleware(), (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
