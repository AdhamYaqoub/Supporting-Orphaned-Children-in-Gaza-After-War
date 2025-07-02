
const express = require('express');
const router = express.Router();
const uthorizeRoles = require('./../middleware/authMiddleware'); 
const campaignController = require('../controllers/campaignController');

router.post('/campaigns', uthorizeRoles(['orphanage']), campaignController.createCampaign);
router.get('/campaigns', campaignController.getAllCampaigns);
router.get('/campaigns/:campaignId', campaignController.getCampaignById);
router.put('/campaigns/:campaignId', uthorizeRoles(['orphanage']), campaignController.updateCampaign);
router.delete('/campaigns/:campaignId', uthorizeRoles(['orphanage', 'admin']), campaignController.deleteCampaign);
module.exports = router;

