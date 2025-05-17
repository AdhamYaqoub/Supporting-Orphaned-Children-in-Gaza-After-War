const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");
const User = require("../models/User");

let activeTokens = new Set();

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken || !activeTokens.has(refreshToken)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Invalid refresh token" });
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
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
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
      if (error) return res.status(500).json({ error: "Error sending email" });
      res.json({ message: "Password reset link sent to email" });
    });
  } catch (error) {
    console.error("خطأ أثناء إعادة تعيين كلمة المرور:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
};

exports.resetPasswordForm = (req, res) => {
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
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user)
      return res.status(404).json({ error: "Invalid or expired reset token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error); // ✅ اطبع الخطأ
    res.status(500).json({ error: "Error resetting password" });
  }
};

exports.activeTokens = activeTokens;
