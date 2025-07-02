const { OrphanUpdate } = require("../models");

exports.createUpdate = async (req, res) => {
  try {
    const { orphan_id, update_type, description, photo_url, date } = req.body;

    if (!orphan_id || !update_type) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newUpdate = await OrphanUpdate.create({
      orphan_id,
      update_type,
      description,
      photo_url,
      date: date || new Date(),
    });

    
    res.status(201).json(newUpdate);
  } catch (err) {
    console.error("Create update error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

exports.getUpdatesByOrphan = async (req, res) => {
  try {
    const { orphanId } = req.params;
    const updates = await OrphanUpdate.findAll({
      where: { orphan_id: orphanId },
      order: [["date", "DESC"]],
    });

    res.json(updates);
  } catch (err) {
    console.error("Get updates error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUpdateById = async (req, res) => {
  try {
    const update = await OrphanUpdate.findByPk(req.params.updateId);
    if (!update) return res.status(404).json({ error: "Update not found" });
    res.json(update);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUpdate = async (req, res) => {
  try {
    const update = await OrphanUpdate.findByPk(req.params.updateId);
    if (!update) return res.status(404).json({ error: "Update not found" });

    await update.update(req.body);
    res.json(update);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    const update = await OrphanUpdate.findByPk(req.params.updateId);
    if (!update) return res.status(404).json({ error: "Update not found" });

    await update.destroy();
    res.json({ message: "Update deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
