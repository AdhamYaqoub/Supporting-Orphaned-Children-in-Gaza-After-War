const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Volunteer = sequelize.define(
  "Volunteer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false }, 

    full_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },

    service_type: DataTypes.ENUM("teaching", "mentoring", "healthcare", "delivery"),

    availability: DataTypes.TEXT, 
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active", 
    },

    latitude: { type: DataTypes.FLOAT },  
    longitude: { type: DataTypes.FLOAT },  

    verification_status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending", 
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Volunteer;
