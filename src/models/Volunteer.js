const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Volunteer = sequelize.define(
  "Volunteer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false }, // رابط مع جدول المستخدمين

    full_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },

    service_type: DataTypes.ENUM("teaching", "mentoring", "healthcare", "delivery"), // ✅ أضفنا delivery للخدمات اللوجستية

    availability: DataTypes.TEXT, // جدول متى متاح للعمل
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active", // ✅ حالة المتطوع (مفعل/موقوف)
    },

    latitude: { type: DataTypes.FLOAT },   // ✅ الموقع الحالي
    longitude: { type: DataTypes.FLOAT },  // ✅ الموقع الحالي

    verification_status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending", // ✅ حالة التحقق من الهوية
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
