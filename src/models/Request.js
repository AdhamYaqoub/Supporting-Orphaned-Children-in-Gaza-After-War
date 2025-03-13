const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orphanage_name: DataTypes.STRING,
    service_needed: DataTypes.STRING,
    status: DataTypes.ENUM('pending', 'matched', 'completed'),
    requested_date: DataTypes.DATE
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);
module.exports = Request;