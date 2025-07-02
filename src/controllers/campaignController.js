
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
       html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #d32f2f; text-align: center;">🚨 New Emergency Campaign Launched!</h2>
      <p style="font-size: 16px; color: #333;">Dear <strong>${donor.name}</strong>,</p>

      <p style="font-size: 16px; color: #555;">
        We hope this message finds you well. A new <strong>Emergency Campaign</strong> has just been launched by the orphanage <strong style="color: #fbc02d;">${user.name}</strong>.
      </p>

      <div style="background-color: #fff9c4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: #f57f17;">📌 Campaign Title: ${title}</h3>
        <p style="margin: 5px 0 0;"><strong>📝 Description:</strong> ${description}</p>
        <p style="margin: 5px 0 0;"><strong>🎯 Target Amount:</strong> <span style="color: green;">$${target_amount}</span></p>
      </div>

      <p style="font-size: 16px; color: #444;">Your support can make a <strong>big difference</strong>.</p>

      <a href="https://your-platform-link.com/campaigns" style="display: inline-block; padding: 12px 20px; background-color: #fbc02d; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">🤝 Donate Now</a>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">Thank you for your continued generosity.<br/>— Supporting Orphaned Children Team</p>
    </div>
  </div>
`,

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
