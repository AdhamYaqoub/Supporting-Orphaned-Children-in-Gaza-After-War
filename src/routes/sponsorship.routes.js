const express = require("express");
const router = express.Router();
const uthorizeRoles = require("./../middleware/authMiddleware");
const {
  createSponsorship,
  getSponsorships,
  getSponsorshipById,
  updateSponsorship,
  deleteSponsorship,
} = require("../controllers/sponsorship.controller");

router.post("/", uthorizeRoles(["donor"]), createSponsorship);
router.get("/", uthorizeRoles(["admin", "donor"]), getSponsorships);
router.get(
  "/:sponsorshipId",
  uthorizeRoles(["admin", "donor"]),
  getSponsorshipById
);

router.put(
  "/:sponsorshipId",
  uthorizeRoles(["admin", "donor"]),
  updateSponsorship
);
router.delete(
  "/:sponsorshipId",
  uthorizeRoles(["admin", "donor"]),
  deleteSponsorship
);

module.exports = router;
