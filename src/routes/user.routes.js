// src/routes/userRoutes.js
const express = require('express');
const { getUsers, addUser } = require('../controllers/user.controller');  // استيراد الدوال من الـ controller

const router = express.Router();

router.get('/users', getUsers);  // المسار لعرض جميع المستخدمين
router.post('/users', addUser);  // المسار لإضافة مستخدم جديد

module.exports = router;
