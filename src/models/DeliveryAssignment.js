const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Donation = require("./Donation");
const User = require("./User"); 
const Volunteer = require("./Volunteer");

const DeliveryAssignment = sequelize.define(
  "DeliveryAssignment",
  {
    
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    donation_id: { type: DataTypes.INTEGER, allowNull: false },
    volunteer_id: { type: DataTypes.INTEGER, allowNull: false },

    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    current_latitude: { type: DataTypes.FLOAT },
    current_longitude: { type: DataTypes.FLOAT },

    // حالة التوصيل
    status: {
      type: DataTypes.ENUM("assigned", "in_progress", "delivered", "cancelled"),
      defaultValue: "assigned",
    },

    notes: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  }
);

Donation.hasOne(DeliveryAssignment, { foreignKey: "donation_id" });
DeliveryAssignment.belongsTo(Donation, { foreignKey: "donation_id" });

Volunteer.hasMany(DeliveryAssignment, { foreignKey: "volunteer_id" });
DeliveryAssignment.belongsTo(Volunteer, { foreignKey: "volunteer_id" });

module.exports = DeliveryAssignment;
