
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

require("dotenv").config();

const router = express.Router();
let activeTokens = new Set(); // لتخزين التوكنات النشطة (يمكن استبداله بـ Redis)

// ✅ تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// ✅ تسجيل الدخول
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        activeTokens.add(token); 
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error); // ✅ طباعة الخطأ في السيرفر
        res.status(500).json({ error: "Error logging in" });
    }
});


// ✅ تسجيل الخروج
router.post("/logout", authMiddleware, (req, res) => {
    const token = req.header("Authorization").split(" ")[1];
    activeTokens.delete(token);
    res.json({ message: "Logged out successfully" });
});

// ✅ عرض الملف الشخصي
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
    }
});

// ✅ تحديث الملف الشخصي
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile" });
    }
});

// ✅ حذف الحساب
router.delete("/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== "Admin" && req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized to delete this account" });
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        await user.destroy();
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting account" });
    }
});

module.exports = router;
