const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matching.Controller");

router.get("/", matchController.getAllMatches);

module.exports = router;
