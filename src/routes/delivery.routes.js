const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/delivery.controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

router.post(
  "/assign-volunteer",
  uthorizeRoles(["orphanage"]),
  deliveryController.assignVolunteerToDonation
);

router.get(
  "/my-assignments",
  uthorizeRoles(["volunteer"]),
  deliveryController.getMyDeliveryAssignments
);

module.exports = router;
