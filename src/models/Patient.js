const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING
    },
    contact: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },
    medical_history: {
        type: DataTypes.TEXT
    }
});

module.exports = Patient;
