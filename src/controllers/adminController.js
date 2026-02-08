const { User, Doctor, Patient, Appointment } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: Doctor, include: [{ model: User, attributes: ['name'] }] },
                { model: Patient, include: [{ model: User, attributes: ['name'] }] }
            ]
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllDoctors,
    getAllPatients,
    getAllAppointments
};
