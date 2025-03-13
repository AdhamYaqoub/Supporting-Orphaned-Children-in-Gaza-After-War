const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    orphanage_name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    feedback: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = Review;