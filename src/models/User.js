const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('donor', 'volunteer', 'admin','orphanage'), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // 🛠️ أضف هذه الحقول الجديدة:
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiration: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: "users",
    timestamps: false,
    underscored: true
  }
);
module.exports = User;