const { EmergencyCampaign, Donation, Organization } = require("../models");
const { Op } = require("sequelize");
const { exportToExcel, exportToPDF } = require("../utils/exporter");

// Search donations and campaigns
exports.searchData = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Search term is required" });

    let donations, campaigns;

    
    if (req.user.role === "admin") {
      donations = await Donation.findAll({ where: { name: { [Op.like]: `%${query}%` } } });
      campaigns = await EmergencyCampaign.findAll({ where: { title: { [Op.like]: `%${query}%` } } });
    } else if (req.user.role === "orphanage") {
      const organization = await Organization.findOne({ where: { user_id: req.user.id } });
      if (!organization) return res.status(404).json({ error: "Organization not found" });
      const organizationId = organization.id;

      donations = await Donation.findAll({
        where: {
          name: { [Op.like]: `%${query}%` },
          organization_id: organizationId,
        },
      });

      campaigns = await EmergencyCampaign.findAll({
        where: {
          title: { [Op.like]: `%${query}%` },
          organization_id: organizationId,
        },
      });
    }

    res.json({ donations, campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export donations as XLSX
exports.exportExcel = async (req, res) => {
  try {
    let donations;

    if (req.user.role === "admin") {
      donations = await Donation.findAll();
    } else if (req.user.role === "orphanage") {
      const organization = await Organization.findOne({ where: { user_id: req.user.id } });
      if (!organization) return res.status(404).json({ error: "Organization not found" });

      const organizationId = organization.id;

      const campaigns = await EmergencyCampaign.findAll({
        where: { organization_id: organizationId },
        attributes: ['id']
      });

      const campaignIds = campaigns.map(c => c.id);

      donations = await Donation.findAll({
        where: {
          [Op.or]: [
            { organization_id: organizationId },
            ...(campaignIds.length > 0 ? [{ campaign_id: { [Op.in]: campaignIds } }] : [])
          ]
        }
      });
    }

    const excelBuffer = await exportToExcel(donations);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=test.xlsx');
    res.send(excelBuffer);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Export donations as PDF
exports.exportPDF = async (req, res) => {
  try {
    let donations;

    if (req.user.role === "admin") {
      donations = await Donation.findAll();
    } else if (req.user.role === "orphanage") {
      const organization = await Organization.findOne({ where: { user_id: req.user.id } });
      if (!organization) return res.status(404).json({ error: "Organization not found" });

      const organizationId = organization.id;

      // Get campaigns belonging to this orphanage
      const campaigns = await EmergencyCampaign.findAll({ 
        where: { organization_id: organizationId }, 
        attributes: ['id'] 
      });

      const campaignIds = campaigns.map(c => c.id);

      // Get both direct and campaign-related donations
      donations = await Donation.findAll({
  where: {
    [Op.or]: [
      { organization_id: organizationId },
      ...(campaignIds.length > 0 ? [{ campaign_id: { [Op.in]: campaignIds } }] : [])
    ]
  },
  attributes: ["id", "category", "amount", "created_at"]
});

    }


    const pdfBuffer = await exportToPDF(donations);
    res.contentType("application/pdf").send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};