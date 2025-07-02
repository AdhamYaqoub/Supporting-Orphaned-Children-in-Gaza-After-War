const express = require('express');
const router = express.Router();
const uthorizeRoles = require('./../middleware/authMiddleware'); 
const donationController = require('../controllers/donation.controller');

// Create donation
router.post('/donations', uthorizeRoles(['donor']), donationController.createDonation);

// Get all donations
router.get('/donations', uthorizeRoles(['admin']), donationController.getAllDonations);

// Get donation by ID
router.get('/donations/:donationId', uthorizeRoles(['admin']), donationController.getDonationById);


// Update donation
router.put('/donations/:donationId', uthorizeRoles(['donor']), donationController.updateDonation);

// Delete donation
router.delete('/donations/:donationId', uthorizeRoles(['donor']), donationController.deleteDonation);

module.exports = router;
