// models/request.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define(
  "Request",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    service_needed: {
      type: DataTypes.ENUM("teaching", "mentoring", "healthcare", "delivery"),
      allowNull: false,
    },
    Publication_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    requested_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "matched", "completed"),
      defaultValue: "pending",
    },
    required_volunteers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Request;
