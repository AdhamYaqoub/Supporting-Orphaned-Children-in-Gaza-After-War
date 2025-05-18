const express = require('express');
const router = express.Router();
const DeliveryAssignment = require('../models/DeliveryAssignment');
const Donation = require('../models/Donation');

// POST /api/delivery/assign
router.post('/assign', async (req, res) => {
  try {
    const { donation_id, volunteer_id, notes } = req.body;

    // تحقق من وجود التبرع
    const donation = await Donation.findByPk(donation_id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    // أنشئ التعيين
    const assignment = await DeliveryAssignment.create({
      donation_id,
      volunteer_id,
      notes
    });

    // حدث حالة التبرع
    donation.status = 'picked_up';
    await donation.save();

    res.status(201).json({ message: 'Volunteer assigned', assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while assigning volunteer' });
  }
});

module.exports = router;
