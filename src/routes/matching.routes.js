// routes/matchingRoutes.js
const express = require('express');
const router = express.Router();
const { matchVolunteersToRequest } = require('../controllers/matchingController');

// تطابق المتطوعين مع الطلب
router.get('/match/:requestId', matchVolunteersToRequest);

module.exports = router;
