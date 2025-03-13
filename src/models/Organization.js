const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Organization = sequelize.define('Organization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = Organization;