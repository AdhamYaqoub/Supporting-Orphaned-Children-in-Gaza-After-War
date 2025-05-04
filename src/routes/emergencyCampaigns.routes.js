const express = require('express');
const router = express.Router();
const { EmergencyCampaign, Organization } = require('../models');
const uthorizeRoles = require('./../middleware/authMiddleware'); 

// Create a campaign   
router.post('/campaigns',  uthorizeRoles(['orphanage']), async (req, res) => {
  try {
    const { title, description, target_amount } = req.body;

    // 🟢 اجلب المنظمة الخاصة بالمستخدم الحالي
    const organization = await Organization.findOne({ where: { user_id: req.user.id } });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found for this user.' });
    }

    // ✅ إنشاء الحملة
    const campaign = await EmergencyCampaign.create({
      user_id: req.user.id,
      title,
      description,
      target_amount,
      organization_id: organization.id, // استخدم id الخاص بالمنظمة
    });

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
router.put('/campaigns/:campaignId',uthorizeRoles(['orphanage']), async (req, res) => {
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
router.delete('/campaigns/:campaignId',uthorizeRoles(['donor', 'admin']), async (req, res) => {
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