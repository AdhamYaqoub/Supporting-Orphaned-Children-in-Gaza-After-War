const { Orphan, Organization } = require("../models");

exports.createOrphan = async (req, res) => {
  try {
    let organizationId;
    if (req.user.role === "orphanage") {
      const org = await Organization.findOne({
        where: { user_id: req.user.id },
      });
      if (!org)
        return res.status(403).json({ error: "Organization not found" });
      organizationId = org.id;
    } else {
      organizationId = req.body.organization_id;
    }
    const orphan = await Orphan.create({
      ...req.body,
      organization_id: organizationId,
    });
    res.status(201).json(orphan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrphans = async (req, res) => {
  try {
    const orphans = await Orphan.findAll();
    res.json(orphans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrphanById = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.orphanId);
    if (!orphan) return res.status(404).json({ error: "Orphan not found" });
    res.json(orphan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.orphanId);
    if (!orphan) return res.status(404).json({ error: "Orphan not found" });
    if (req.user.role === "orphanage") {
      const org = await Organization.findOne({
        where: { user_id: req.user.id },
      });
      if (orphan.organization_id !== org.id)
        return res.status(403).json({ error: "Unauthorized" });
    }
    await orphan.update(req.body);
    res.json(orphan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.orphanId);
    if (!orphan) return res.status(404).json({ error: "Orphan not found" });
    if (req.user.role === "orphanage") {
      const org = await Organization.findOne({
        where: { user_id: req.user.id },
      });
      if (orphan.organization_id !== org.id)
        return res.status(403).json({ error: "Unauthorized" });
    }
    await orphan.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
