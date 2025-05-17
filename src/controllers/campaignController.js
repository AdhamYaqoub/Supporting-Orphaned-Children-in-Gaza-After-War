
const { EmergencyCampaign, Organization, User } = require('../models');
const nodemailer = require("nodemailer");

exports.createCampaign = async (req, res) => {
  try {
    const { title, description, target_amount } = req.body;

    const organization = await Organization.findOne({ where: { user_id: req.user.id } });
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found for this user.' });
    }

    const campaign = await EmergencyCampaign.create({
      user_id: req.user.id,
      title,
      description,
      target_amount,
      organization_id: organization.id,
    });

    const donors = await User.findAll({ where: { role: 'donor' } });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    for (let donor of donors) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: donor.email,
        subject: "🚨 New emergency campaign!",
        text: `Dear ${donor.name},

We hope this message finds you well.

A new **Emergency Campaign** has just been launched by the orphanage **${user.name}**.

📌 **Campaign Title:** ${title}
📝 **Description:** ${description}
🎯 **Target Amount:** $${target_amount}

Your support can make a big difference.

Please consider donating and sharing this campaign with others who might help.

Thank you for your continued generosity!

Best regards,  
Supporting Orphaned Children Team`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(campaign);
  } catch (err) {
    console.error("Error creating campaign or sending emails:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await EmergencyCampaign.findAll();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const organization = await Organization.findOne({ where: { user_id: req.user.id } });

    if (req.user.role === 'orphanage' && campaign.organization_id !== organization.id) {
      return res.status(403).json({ error: 'You are not authorized to update this campaign.' });
    }

    const { title, description, target_amount } = req.body;

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (target_amount !== undefined) {
      updatedFields.target_amount = target_amount;

      if (parseFloat(target_amount) <= parseFloat(campaign.collected_amount)) {
        updatedFields.status = 'completed';
      } else {
        updatedFields.status = 'active';
      }
    }

    await campaign.update(updatedFields);

    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await EmergencyCampaign.findByPk(req.params.campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const organization = await Organization.findOne({ where: { user_id: req.user.id } });

    if (req.user.role === 'orphanage' && campaign.organization_id !== organization.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this campaign.' });
    }

    await campaign.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
