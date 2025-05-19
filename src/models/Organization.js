const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Organization = sequelize.define('Organization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false } ,
    name_orphanage: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    contact_email:{ type: DataTypes.STRING, unique: true, allowNull: false },
  latitude: { type: DataTypes.DOUBLE },   
  longitude: { type: DataTypes.DOUBLE }, 
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, 
}
);

module.exports = Organization;