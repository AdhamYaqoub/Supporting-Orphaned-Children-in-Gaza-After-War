const express = require("express");
const router = express.Router();
const orphanUpdateController = require("../controllers/OrphanUpdate.controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

router.post(
  "/",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.createUpdate
);

router.get(
  "/orphan/:orphanId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.getUpdatesByOrphan
);

router.get(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.getUpdateById
);

router.put(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.updateUpdate
);

router.delete(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.deleteUpdate
);

module.exports = router;
