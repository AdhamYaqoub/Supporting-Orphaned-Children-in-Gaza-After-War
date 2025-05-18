const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/delivery.controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

// تعيين متطوع لتوصيل تبرع
router.post(
  "/assign-volunteer",
  uthorizeRoles(["orphanage"]),
  deliveryController.assignVolunteerToDonation
);

// إحضار المهام المخصصة لمتطوع
router.get(
  "/my-assignments",
  uthorizeRoles(["volunteer"]),
  deliveryController.getMyDeliveryAssignments
);

module.exports = router;
