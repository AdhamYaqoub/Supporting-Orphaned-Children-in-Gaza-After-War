const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const dashboardController = require("../controllers/dashboard.controller");


router.get("/stats", authMiddleware, dashboardController.getStats);


router.get("/logs", authMiddleware, dashboardController.getLogs);

module.exports = router;
