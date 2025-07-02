const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryAssignment.controller');
const uthorizeRoles = require('./../middleware/authMiddleware'); 

router.post('/',uthorizeRoles(['orphanage']), controller.createAssignment);

router.get('/volunteer/:volunteer_id',uthorizeRoles(['orphanage']), controller.getAssignmentsByVolunteer);

router.put('/:id/status',uthorizeRoles(['volunteer']), controller.updateStatus);

router.put('/:id/cancel',uthorizeRoles(['orphanage']), controller.cancelAssignment);



module.exports = router;
