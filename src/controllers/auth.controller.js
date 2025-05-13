const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const connectDB = require('../config/database'); // Assuming you have a connectDB function to connect to your MongoDB

// ⛔ Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Your Password',
      text: `Click the link to reset your password:\n${resetLink}`,
    });

    res.status(200).json({ message: 'Reset link sent to email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: 'Missing token or password.' });

  try {
    const decoded = jwt.verify(token, process.env.RESET_SECRET);

    const db = await connectDB();
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: 'Password has been reset successfully.' });

  }catch (err) {
  console.error("Error in forgotPassword:", err);  // 🔍 أضف هذا السطر
  res.status(500).json({ message: 'Failed to send reset email.' });
}

};

module.exports = { forgotPassword, resetPassword };
