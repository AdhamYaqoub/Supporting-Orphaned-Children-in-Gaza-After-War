const express = require("express");
const router = express.Router();
const donationController = require("../controllers/additionalFeatures");
const uthorizeRoles = require('./../middleware/authMiddleware'); 

router.get("/search", uthorizeRoles(["admin", "orphanage"]), donationController.searchData);
router.get("/export/csv", uthorizeRoles(["admin", "orphanage"]), donationController.exportCSV);
router.get("/export/pdf", uthorizeRoles(["admin", "orphanage"]), donationController.exportPDF);

module.exports = router;