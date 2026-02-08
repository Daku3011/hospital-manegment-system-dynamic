const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');

// User Relationships
User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Patient, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId' });

// Appointment Relationships
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = {
    sequelize,
    User,
    Doctor,
    Patient,
    Appointment
};
