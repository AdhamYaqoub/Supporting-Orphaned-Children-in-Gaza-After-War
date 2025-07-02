const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orphan = sequelize.define('Orphan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organization_id: { type: DataTypes.INTEGER, allowNull: true }, 
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    education_status: DataTypes.STRING,
    health_condition: DataTypes.TEXT,
    orphanage_name: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false, 
  }
);


module.exports = Orphan;
