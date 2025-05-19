const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.Controller");
const uthorizeRoles = require("./../middleware/authMiddleware");

router.post("/", uthorizeRoles(["orphanage"]), requestController.createRequest);
router.get(
  "/",
  uthorizeRoles(["admin", "volunteer"]),
  requestController.getAllRequests
);
router.get(
  "/getAllMatchRequests",
  uthorizeRoles(["admin", "volunteer"]),
  requestController.getMatchingRequests
);
router.get(
  "/:requestId",
  uthorizeRoles(["admin", "volunteer"]),
  requestController.getRequestById
);

router.put(
  "/:requestId",
  uthorizeRoles(["orphanage"]),
  requestController.updateRequest
);
router.delete(
  "/:requestId",
  uthorizeRoles(["admin", "orphanage"]),
  requestController.deleteRequest
);



module.exports = router;
