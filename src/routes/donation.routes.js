const express = require('express');
const router = express.Router();
const { Donation , Transaction, EmergencyCampaign, sequelize } = require('../models');
const uthorizeRoles = require('./../middleware/authMiddleware'); // استيراد الميدل وير الخاص بالتحقق من التوكن

// Create a donation
router.post('/donations', uthorizeRoles(['donor']), async (req, res) => {
    try {
      const { name, amount, category, organization_id, donation_item, quantity, campaign_id } = req.body;
  
      // التأكد من وجود المؤسسة أو الحملة إن تم تحديدها
      if (!organization_id && !campaign_id) {
        return res.status(400).json({ error: 'Please provide either organization_id or campaign_id' });
      }
      const updatedCampaign = await EmergencyCampaign.findByPk(campaign_id);

        let donationData = {
            user_id: req.user.id,
            name,
            amount,
            category,
            organization_id,
            campaign_id,
            donation_item,
            quantity
          };

        if (campaign_id && updatedCampaign.status == 'completed') {
          return res.status(400).json({ error: 'Please provide either organization_id or campaign_id' });
        }
        
        const donation = await Donation.create(donationData);
        
    
      // إذا كان التبرع يحتوي على مبلغ مالي
      if (amount) {
        const fee = parseFloat(amount) * 0.05;
        const totalAmount = parseFloat(amount) - fee;
  
        let transactionType = 'donation';
        if (campaign_id) transactionType = 'campaign';
  
        await Transaction.create({
          user_id: req.user.id,
          amount,
          fee,
          total_amount: totalAmount,
          transaction_type: transactionType,
          donation_id: donation.id
        });
  
        // إذا كان التبرع لحملة طارئة
        if (campaign_id) {
          // تحديث المبلغ المتجمع باستخدام sequelize.literal
          await EmergencyCampaign.update(
            {
              collected_amount: sequelize.literal(`collected_amount + ${totalAmount}`)
            },
            { where: { id: campaign_id } }
          );
  
          // إعادة جلب الحملة للتأكد من حالة الجمع
          if (parseFloat(updatedCampaign.collected_amount) >= parseFloat(updatedCampaign.target_amount)) {
            await updatedCampaign.update({ status: 'completed' });
          }
        }
      }
  
      res.status(201).json(donation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  

// Get all donations
router.get('/donations', uthorizeRoles(['admin']), async (req, res) => {
    try {
        const donations = await Donation.findAll();
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single donation by ID
router.get('/donations/:donationId', uthorizeRoles(['admin']), async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a donation
router.put('/donations/:donationId', uthorizeRoles(['donor']), async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        if (donation.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied: Not your donation' });
        }

        await donation.update(req.body);
        res.json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a donation
router.delete('/donations/:donationId', uthorizeRoles(['donor']),  async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });

        if (donation.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied: Not your donation' });
        }
        
        await donation.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
