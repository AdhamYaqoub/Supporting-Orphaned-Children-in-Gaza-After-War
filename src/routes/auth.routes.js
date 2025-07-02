const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/auth.controller");

// Refresh Token
router.post("/refresh", authMiddleware, authController.refreshToken);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);


// Reset Password Form
router.get("/reset-password/:resetToken", authController.resetPasswordForm);

// Reset Password Submission
router.post("/reset-password/:resetToken", authController.resetPassword);

module.exports = router;
