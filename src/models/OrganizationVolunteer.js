const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrganizationVolunteer = sequelize.define('OrganizationVolunteer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  volunteer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = OrganizationVolunteer;
