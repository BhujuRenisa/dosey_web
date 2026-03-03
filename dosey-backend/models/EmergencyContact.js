const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyContact = sequelize.define('EmergencyContact', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    relationship: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = EmergencyContact;
