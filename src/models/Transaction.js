const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: DataTypes.DECIMAL(10, 2), // المبلغ الأصلي
    fee: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // قيمة الرسوم
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // المبلغ بعد الرسوم
    transaction_type: DataTypes.ENUM('donation', 'sponsorship', 'campaign'),
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false,
});

module.exports = Transaction;
