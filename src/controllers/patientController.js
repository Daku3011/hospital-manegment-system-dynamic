const { Patient, User, Appointment, Doctor } = require('../models');

const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: { userId: req.user.id },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updatePatientProfile = async (req, res) => {
    try {
        const { age, gender, contact, address, medical_history } = req.body;
        const patient = await Patient.findOne({ where: { userId: req.user.id } });

        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        patient.age = age || patient.age;
        patient.gender = gender || patient.gender;
        patient.contact = contact || patient.contact;
        patient.address = address || patient.address;
        patient.medical_history = medical_history || patient.medical_history;

        await patient.save();

        res.json({ message: 'Profile updated successfully', patient });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const appointments = await Appointment.findAll({
            where: { patientId: patient.id },
            include: [{
                model: Doctor,
                include: [{ model: User, attributes: ['name'] }]
            }]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date_time, reason } = req.body;
        const patient = await Patient.findOne({ where: { userId: req.user.id } });

        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const appointment = await Appointment.create({
            patientId: patient.id,
            doctorId,
            date_time,
            reason,
            status: 'pending'
        });

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [{ model: User, attributes: ['name'] }]
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPatientProfile,
    updatePatientProfile,
    getPatientAppointments,
    bookAppointment,
    getAllDoctors
};
