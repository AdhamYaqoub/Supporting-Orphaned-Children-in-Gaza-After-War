const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Donation = sequelize.define('Donation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },

  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2) },         
  donation_item: { type: DataTypes.STRING },          
  quantity: { type: DataTypes.INTEGER },              

  category: {
    type: DataTypes.ENUM('general', 'education', 'medical', 'clothes', 'food'),
    allowNull: false,
    defaultValue: 'general'
  },

  pickup_address: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DOUBLE },
  longitude: { type: DataTypes.DOUBLE },

  status: {
    type: DataTypes.ENUM('pending', 'picked_up', 'delivered'),
    defaultValue: 'pending'
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Donation;
