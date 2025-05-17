const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/user.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.delete("/:userId", authMiddleware, authController.deleteUser);

module.exports = router;
