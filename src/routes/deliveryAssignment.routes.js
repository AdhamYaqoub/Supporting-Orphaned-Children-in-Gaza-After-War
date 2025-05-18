const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryAssignment.controller');
const uthorizeRoles = require('./../middleware/authMiddleware'); 

// POST: إنشاء مهمة جديدة
router.post('/',uthorizeRoles(['orphanage']), controller.createAssignment);

// GET: كل المهام لمتطوع معيّن
router.get('/volunteer/:volunteer_id',uthorizeRoles(['orphanage']), controller.getAssignmentsByVolunteer);

// PUT: تحديث حالة مهمة
router.put('/:id/status',uthorizeRoles(['volunteer']), controller.updateStatus);

// PUT: إلغاء المهمة
router.put('/:id/cancel',uthorizeRoles(['orphanage']), controller.cancelAssignment);


module.exports = router;
