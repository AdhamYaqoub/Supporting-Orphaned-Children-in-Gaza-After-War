const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');

router.post('/', volunteerController.createVolunteer);
router.get('/', volunteerController.getAllVolunteers);
router.get('/:volunteerId', volunteerController.getVolunteerById);
router.put('/:volunteerId', volunteerController.updateVolunteer);
router.delete('/:volunteerId', volunteerController.deleteVolunteer);

module.exports = router;