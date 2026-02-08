const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availability: {
        type: DataTypes.STRING, // e.g., "Mon-Fri 9am-5pm"
        defaultValue: "Mon-Fri 09:00-17:00"
    }
});

module.exports = Doctor;
