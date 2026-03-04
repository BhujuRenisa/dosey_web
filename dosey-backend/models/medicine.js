const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicine = sequelize.define('Medicine', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'mg',
  },
  frequency: {
    type: DataTypes.STRING,
  },
  specificDays: {
    type: DataTypes.STRING, 
  },
  time: {
    type: DataTypes.STRING,
  },
  reminderTimes: {
    type: DataTypes.TEXT, 
  },
  colorTag: {
    type: DataTypes.STRING,
    defaultValue: '#708238',
  },
  shape: {
    type: DataTypes.STRING,
    defaultValue: 'circle',
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  refillThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Medicine;