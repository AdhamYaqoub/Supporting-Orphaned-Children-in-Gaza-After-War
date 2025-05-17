const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const uthorizeRoles = require("./../middleware/authMiddleware");
const {
  createOrphan,
  getOrphans,
  getOrphanById,
  updateOrphan,
  deleteOrphan,
} = require("../controllers/orphan.controller");

router.post("/", uthorizeRoles(["admin", "orphanage"]), createOrphan);
router.get("/", uthorizeRoles(["admin", "orphanage", "donor"]), getOrphans);
router.get(
  "/:orphanId",
  uthorizeRoles(["admin", "orphanage", "donor"]),
  getOrphanById
);
router.put(
  "/:orphanId",
  authMiddleware,
  uthorizeRoles(["admin", "orphanage"]),
  updateOrphan
);
router.delete(
  "/:orphanId",
  authMiddleware,
  uthorizeRoles(["admin", "orphanage"]),
  deleteOrphan
);

module.exports = router;
