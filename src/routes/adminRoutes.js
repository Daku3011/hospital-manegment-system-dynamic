const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', authMiddleware(['admin']), adminController.getAllUsers);
router.get('/doctors', authMiddleware(['admin']), adminController.getAllDoctors);
router.get('/patients', authMiddleware(['admin']), adminController.getAllPatients);
router.get('/appointments', authMiddleware(['admin']), adminController.getAllAppointments);

module.exports = router;
