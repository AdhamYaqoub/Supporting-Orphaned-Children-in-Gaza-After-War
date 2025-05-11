const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');
const uthorizeRoles = require('./../middleware/authMiddleware'); 

router.get('/', uthorizeRoles(['admin','orphanage']), volunteerController.getAllVolunteers);//
router.get('/:volunteerId',uthorizeRoles(['admin','orphanage']), volunteerController.getVolunteerById);//
router.put('/:volunteerId',uthorizeRoles(['admin','volunteer']), volunteerController.updateVolunteer);//
router.delete('/:volunteerId',uthorizeRoles(['admin','volunteer']), volunteerController.deleteVolunteer);//
// incomplete
router.get('/:orphanageId/volunteers',uthorizeRoles(['admin','orphanage']), volunteerController.getVolunteersByOrphanageId);

module.exports = router;