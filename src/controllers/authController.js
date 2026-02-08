const { User, Doctor, Patient } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const user = await User.create({ name, email, password, role });

        // Create associated profile if necessary
        if (role === 'doctor') {
            await Doctor.create({ userId: user.id, specialization: 'General', availability: 'Mon-Fri 09:00-17:00' });
        } else if (role === 'patient') {
            await Patient.create({ userId: user.id });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login
};
