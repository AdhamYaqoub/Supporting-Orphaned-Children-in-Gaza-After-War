const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Volunteer = sequelize.define(
  "Volunteer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    service_type: DataTypes.ENUM("teaching", "mentoring", "healthcare"),
    availability: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false, // منع إنشاء createdAt و updatedAt
  }
);

module.exports = Volunteer;
