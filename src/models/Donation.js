const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Donation = sequelize.define('Donation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false }, // إضافة عمود name
    amount: DataTypes.DECIMAL(10, 2),
    category: DataTypes.ENUM('general', 'education', 'medical'),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false, // منع إنشاء createdAt و updatedAt
  }
);

module.exports = Donation;
