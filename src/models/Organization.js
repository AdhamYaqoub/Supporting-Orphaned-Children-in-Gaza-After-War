const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Organization = sequelize.define('Organization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false } ,// يشير إلى المستخدم المرتبط بالمنظمة
    name_orphanage: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    contact_email:{ type: DataTypes.STRING, unique: true, allowNull: false },
      // ✅ خطوط العرض والطول لتحديد موقع المنظمة على الخريطة
  latitude: { type: DataTypes.DOUBLE },   // مثال: 31.9522
  longitude: { type: DataTypes.DOUBLE },  // مثال: 35.2332
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
  timestamps: false, // منع إنشاء createdAt و updatedAt
}
);

module.exports = Organization;