const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sponsorship = sequelize.define(
  "Sponsorship",
  {
    donor_id: DataTypes.INTEGER,
    orphan_id: DataTypes.INTEGER,
    sponsorship_type: {
      type: DataTypes.ENUM("education", "medical", "financial"),
      allowNull: false,
      defaultValue: "financial",
    },
    
    amount: DataTypes.FLOAT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    payment_frequency: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: false,
      defaultValue: "monthly",
    },
  },
  {
    timestamps: false, 
  }
);

module.exports = Sponsorship;
