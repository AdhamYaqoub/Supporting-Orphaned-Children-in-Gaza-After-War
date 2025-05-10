const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define('Match', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  volunteer_id: { type: DataTypes.INTEGER, allowNull: false },
  request_id: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
}, {
  timestamps: true,
});

module.exports = Match;
