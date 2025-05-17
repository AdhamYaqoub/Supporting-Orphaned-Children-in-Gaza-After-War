const { Donation, Transaction, EmergencyCampaign, sequelize, User } = require('../models');
const nodemailer = require("nodemailer");

exports.createDonation = async (req, res) => {
  try {
    const { name, amount, category, organization_id, donation_item, quantity, campaign_id } = req.body;

    if (!organization_id && !campaign_id) {
      return res.status(400).json({ error: 'Please provide either organization_id or campaign_id' });
    }

    if (campaign_id) {
      const campaign = await EmergencyCampaign.findByPk(campaign_id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found.' });
      }

      if (campaign.status === 'completed') {
        return res.status(400).json({ error: 'This campaign has already been completed.' });
      }
    }

    const donation = await Donation.create({
      user_id: req.user.id,
      name,
      amount,
      category,
      organization_id,
      campaign_id,
      donation_item,
      quantity
    });

    if (amount) {
      const fee = parseFloat(amount) * 0.05;
      const totalAmount = parseFloat(amount) - fee;
      const transactionType = campaign_id ? 'campaign' : 'donation';

      await Transaction.create({
        user_id: req.user.id,
        amount,
        fee,
        total_amount: totalAmount,
        transaction_type: transactionType,
        donation_id: donation.id
      });

      if (campaign_id) {
        await EmergencyCampaign.update(
          { collected_amount: sequelize.literal(`collected_amount + ${totalAmount}`) },
          { where: { id: campaign_id } }
        );

        const updatedCampaign = await EmergencyCampaign.findByPk(campaign_id);
        if (parseFloat(updatedCampaign.collected_amount) >= parseFloat(updatedCampaign.target_amount)) {
          await updatedCampaign.update({ status: 'completed' });
        }
      }

      // 💌 إرسال الإيميل للمتبرع
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const user = await User.findOne({ where: { id: req.user.id } });


      const mailOptions = {
  from: process.env.EMAIL,
  to: req.user.email,
  subject: "✅ Donation Confirmation",
  text: `Dear ${user.name},

Thank you for your generous donation.

We are pleased to inform you that a donation of $${amount} has been successfully processed from your account in support of the cause${campaign_id ? ' in the emergency campaign' : ''}.

Your contribution is truly appreciated and will go a long way in helping those in need.

Best regards,  
Supporting Orphaned Children Team`
};

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(donation);
  } catch (err) {
    console.error("Error creating donation or sending email:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await donation.update(req.body);
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    if (donation.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await donation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
