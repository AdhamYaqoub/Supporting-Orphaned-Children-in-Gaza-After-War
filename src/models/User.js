const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('donor', 'volunteer', 'admin','orphanage'), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users", // ✅ تحديد اسم الجدول لمنع تحويله إلى "Users"
    timestamps: false,  // ✅ منع Sequelize من إضافة createdAt و updatedAt
    underscored: true   // ✅ التأكد من استخدام snake_case
  }
);

module.exports = User;
