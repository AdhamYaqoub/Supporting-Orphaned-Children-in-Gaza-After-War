const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VolunteerApplication = sequelize.define(
  "VolunteerApplication",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    volunteer_id: { type: DataTypes.INTEGER, allowNull: false },
    request_id: { type: DataTypes.INTEGER, allowNull: false },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = VolunteerApplication;
