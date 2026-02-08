const { Doctor, User, Appointment, Patient } = require('../models');

const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateDoctorProfile = async (req, res) => {
    try {
        const { specialization, availability } = req.body;
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        doctor.specialization = specialization || doctor.specialization;
        doctor.availability = availability || doctor.availability;
        await doctor.save();

        res.json({ message: 'Profile updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const appointments = await Appointment.findAll({
            where: { doctorId: doctor.id },
            include: [{
                model: Patient,
                include: [{ model: User, attributes: ['name'] }]
            }]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Verify that this appointment belongs to the logged-in doctor
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
        if (appointment.doctorId !== doctor.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: 'Appointment status updated', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus
};
