// src/controllers/user.controller.js
const { User } = require('../models/User');  // استيراد نموذج المستخدم

// دالة لجلب جميع المستخدمين
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();  // جلب جميع المستخدمين من قاعدة البيانات
    res.json(users);  // إرجاع البيانات على شكل JSON
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });  // معالجة الخطأ
  }
};

// دالة لإضافة مستخدم جديد
const addUser = async (req, res) => {
  const { name, email } = req.body;  // جلب البيانات من الطلب (request)

  try {
    const newUser = await User.create({ name, email });  // إضافة مستخدم جديد إلى قاعدة البيانات
    res.status(201).json(newUser);  // إرجاع المستخدم المضاف مع حالة HTTP 201
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(400).json({ message: 'Error creating user' });  // معالجة الخطأ في حال الفشل
  }
};

module.exports = { getUsers, addUser };  // تصدير الدوال للاستخدام في المسارات
