const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const dashboardController = require("../controllers/dashboard.controller");
const uthorizeRoles = require('./../middleware/authMiddleware'); 


router.get("/stats",uthorizeRoles(['donor']), authMiddleware, dashboardController.getStats);


router.get("/logs",uthorizeRoles(['donor']), authMiddleware, dashboardController.getLogs);


module.exports = router;
