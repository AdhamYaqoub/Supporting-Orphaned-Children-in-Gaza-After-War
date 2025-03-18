const express = require('express');
const router = express.Router();
const { EmergencyCampaign } = require('../models');


router.post('/campaigns', async (req, res) => {
    try {
        const campaign = await EmergencyCampaign.create(req.body);
        res.status(201).json(campaign);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await EmergencyCampaign.findAll();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single campaign by ID
router.get('/campaigns/:campaignId', async (req, res) => {
    try {
        const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a campaign
router.put('/campaigns/:campaignId', async (req, res) => {
    try {
        const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        await campaign.update(req.body);
        res.json(campaign);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a campaign
router.delete('/campaigns/:campaignId', async (req, res) => {
    try {
        const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        await campaign.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;