const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Sync
const { sequelize } = require('./src/models');
sequelize.sync({ force: false }) // Set force: true to drop tables on every startup
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
