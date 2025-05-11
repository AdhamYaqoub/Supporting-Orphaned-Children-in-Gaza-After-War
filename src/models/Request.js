// models/request.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  service_needed: {
    type: DataTypes.ENUM('teaching', 'mentoring', 'healthcare'),
    allowNull: false
  },
  requested_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'matched', 'completed'),
    defaultValue: 'pending'
  }

}, {
  timestamps: false,
});

module.exports = Request;
