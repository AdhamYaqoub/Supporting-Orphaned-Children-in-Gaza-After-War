// models/OrphanUpdate.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrphanUpdate = sequelize.define(
  "OrphanUpdate",
  {
    orphan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    update_type: {
      type: DataTypes.ENUM("photo", "progress_report", "medical_update"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media_url: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);


module.exports = OrphanUpdate;
