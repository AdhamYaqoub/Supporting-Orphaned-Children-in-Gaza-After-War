const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyCampaign = sequelize.define('EmergencyCampaign', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    target_amount: DataTypes.DECIMAL(10, 2),
    collected_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('active', 'completed'), defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = EmergencyCampaign;