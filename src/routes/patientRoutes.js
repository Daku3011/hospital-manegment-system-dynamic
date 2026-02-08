const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware(['patient']), patientController.getPatientProfile);
router.put('/profile', authMiddleware(['patient']), patientController.updatePatientProfile);
router.get('/appointments', authMiddleware(['patient']), patientController.getPatientAppointments);
router.post('/appointments', authMiddleware(['patient']), patientController.bookAppointment);
router.get('/doctors', authMiddleware(['patient']), patientController.getAllDoctors);

module.exports = router;
