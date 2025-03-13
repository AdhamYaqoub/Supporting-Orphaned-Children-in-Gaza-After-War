const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sponsorship = sequelize.define('Sponsorship', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    donor_id: { type: DataTypes.INTEGER, allowNull: false },
    orphan_id: { type: DataTypes.INTEGER, allowNull: false },
    monthly_amount: DataTypes.DECIMAL(10, 2),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = Sponsorship;