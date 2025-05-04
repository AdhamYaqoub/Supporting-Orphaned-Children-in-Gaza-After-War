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
router.put('/campaigns/:campaignId', uthorizeRoles(['orphanage']), async (req, res) => {
    try {
        const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  
        const organization = await Organization.findOne({ where: { user_id: req.user.id } });
  
        if (req.user.role === 'orphanage' && campaign.organization_id !==  organization.id) {
          return res.status(403).json({ error: 'You are not authorized to delete this campaign.' });
        }
  
      const { title, description, target_amount } = req.body;
  
      const updatedFields = {};
      if (title !== undefined) updatedFields.title = title;
      if (description !== undefined) updatedFields.description = description;
      if (target_amount !== undefined) {
        updatedFields.target_amount = target_amount;
  
        // فحص حالة الحملة إذا لازم تتغير
        if (parseFloat(target_amount) <= parseFloat(campaign.collected_amount)) {
          updatedFields.status = 'completed';
        }
        else  if (parseFloat(campaign.collected_amount) < parseFloat(target_amount)) {
          updatedFields.status = 'active';
        }
      }
  
      await campaign.update(updatedFields);
  
      res.json(campaign);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// Delete a campaign
router.delete('/campaigns/:campaignId', uthorizeRoles(['orphanage', 'admin']), async (req, res) => {
    try {
      const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

      const organization = await Organization.findOne({ where: { user_id: req.user.id } });

      if (req.user.role === 'orphanage' && campaign.organization_id !==  organization.id) {
        return res.status(403).json({ error: 'You are not authorized to delete this campaign.' });
      }
  
      await campaign.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;