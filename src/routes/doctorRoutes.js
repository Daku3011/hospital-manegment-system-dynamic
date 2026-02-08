const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware(['doctor']), doctorController.getDoctorProfile);
router.put('/profile', authMiddleware(['doctor']), doctorController.updateDoctorProfile);
router.get('/appointments', authMiddleware(['doctor']), doctorController.getDoctorAppointments);
router.put('/appointments/:id/status', authMiddleware(['doctor']), doctorController.updateAppointmentStatus);

module.exports = router;
