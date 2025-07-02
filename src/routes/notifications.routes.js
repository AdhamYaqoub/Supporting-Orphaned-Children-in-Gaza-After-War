const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const notificationController = require("../controllers/notification.controller");


router.post("/notifications", authMiddleware, notificationController.sendNotification);


router.get("/notifications", authMiddleware, notificationController.getUserNotifications);

module.exports = router;

