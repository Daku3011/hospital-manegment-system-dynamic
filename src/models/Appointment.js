const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_time: {
        type: DataTypes.DATE, // Stores both date and time
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    reason: {
        type: DataTypes.STRING
    }
});

module.exports = Appointment;
