// routes/volunteerApplication.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/volunteerApplication.controller");
const authorizeRoles = require("../middleware/authMiddleware");

router.post("/", authorizeRoles(["volunteer"]), controller.applyToRequest);

router.get(
  "/by-organization",
  authorizeRoles(["orphanage"]),
  controller.getApplicationsForMyRequests
);

router.put(
  "/:applicationId/status",
  authorizeRoles(["orphanage"]),
  controller.updateApplicationStatus
);

module.exports = router;
