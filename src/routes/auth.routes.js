const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer"); // لإرسال البريد الإلكتروني
const crypto = require("crypto"); // لتوليد رمز إعادة تعيين كلمة السر
const authMiddleware = require("../middleware/auth");
const { Op } = require("sequelize"); // هذا مهم لاستخدام Op.gt

require("dotenv").config();

const router = express.Router();
let activeTokens = new Set(); // لتخزين التوكنات النشطة (يمكن استبداله بـ Redis)

// 🚀 تحديث التوكن
router.post("/refresh", authMiddleware, async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken || !activeTokens.has(refreshToken)) {
            return res.status(403).json({ error: "Forbidden: Invalid refresh token" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newToken = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token: newToken });
    } catch (error) {
        res.status(500).json({ error: "Error refreshing token" });
    }
});

// 🚀 نسيان كلمة المرور
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: "User not found" });

        // توليد رمز إعادة تعيين كلمة السر
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiration = Date.now() + 3600000; // صلاحية الرمز ساعة

        // حفظ الرمز في قاعدة البيانات
        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        // إرسال البريد الإلكتروني مع رابط إعادة تعيين كلمة السر
        const transporter = nodemailer.createTransport({
            service: "gmail", // يمكنك تخصيص مزود البريد
            auth: {
                user: process.env.EMAIL, // يجب تعيين هذا في .env
                pass: process.env.EMAIL_PASSWORD, // يجب تعيين هذا في .env
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            text: `You requested a password reset. Please click the link below to reset your password:
            http://localhost:5000/api/auth/reset-password/${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: "Error sending email" });
            }
            res.json({ message: "Password reset link sent to email" });
        });
    }catch (error) {
    console.log("خطأ أثناء إعادة تعيين كلمة المرور:", error); // اطبع الخطأ
    res.status(500).json({ error: "Error resetting password" });
}

});

// 🚀 إعادة تعيين كلمة المرور
router.post("/reset-password/:resetToken", async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ where: { resetToken, resetTokenExpiration: { [Op.gt]: Date.now() } } });

        if (!user) return res.status(404).json({ error: "Invalid or expired reset token" });

        // تحديث كلمة السر
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null; // مسح الرمز بعد التحديث
        user.resetTokenExpiration = null; // مسح تاريخ الانتهاء
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error resetting password" });
    }
});

router.get("/reset-password/:resetToken", async (req, res) => {
    const { resetToken } = req.params;
    res.send(`
        <html>
        <head><title>Reset Password</title></head>
        <body>
            <h2>Reset Your Password</h2>
            <form method="POST" action="/api/auth/reset-password/${resetToken}">
                <input type="password" name="password" placeholder="New Password" required />
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
});


module.exports = router;



