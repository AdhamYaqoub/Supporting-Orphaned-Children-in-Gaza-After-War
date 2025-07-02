const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteer.controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

router.get(
  "/",
  uthorizeRoles(["admin", "orphanage"]),
  volunteerController.getAllVolunteers
); //
router.get(
  "/:volunteerId",
  uthorizeRoles(["admin", "orphanage"]),
  volunteerController.getVolunteerById
); //
router.put(
  
  "/update",
  uthorizeRoles(["admin", "volunteer"]),
  volunteerController.updateVolunteer
); //
router.delete(
  "/:volunteerId",
  uthorizeRoles(["admin", "volunteer"]),
  volunteerController.deleteVolunteer
); //

//test
router.get(
  "/MyVolunteers",
  uthorizeRoles(["admin", "orphanage"]),
  volunteerController.getMyVolunteers
);

module.exports = router;
