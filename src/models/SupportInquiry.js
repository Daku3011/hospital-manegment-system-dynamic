const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SupportInquiry = sequelize.define('SupportInquiry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('General', 'Appointment', 'Doctor', 'Billing', 'Feedback'),
        defaultValue: 'General'
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved_by_ai', 'resolved_by_staff'),
        defaultValue: 'pending'
    },
    aiResponse: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = SupportInquiry;
