const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: DataTypes.DECIMAL(10, 2),
    transaction_type: DataTypes.ENUM('donation', 'sponsorship', 'campaign'),
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = Transaction;