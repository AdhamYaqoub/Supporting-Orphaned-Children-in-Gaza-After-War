const express = require("express");
const router = express.Router();
const orphanUpdateController = require("../controllers/OrphanUpdate.controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

// إنشاء تحديث جديد
router.post(
  "/",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.createUpdate
);

// جلب كل التحديثات لليتيم (orphan)
router.get(
  "/orphan/:orphanId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.getUpdatesByOrphan
);

// جلب تحديث معين
router.get(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.getUpdateById
);

// تعديل تحديث معين
router.put(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.updateUpdate
);

// حذف تحديث معين
router.delete(
  "/:updateId",
  uthorizeRoles(["admin", "orphanage"]),
  orphanUpdateController.deleteUpdate
);

module.exports = router;
