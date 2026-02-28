const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medicine = require('./medicine');

const MedicineHistory = sequelize.define('MedicineHistory', {
    medicineName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dosage: {
        type: DataTypes.STRING,
    },
    frequency: {
        type: DataTypes.STRING,
    },
    takenAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    takenTime: {
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    medicineId: {
        type: DataTypes.INTEGER,
        allowNull: true, // allow null if the original medicine is deleted
    },
});

module.exports = MedicineHistory;
