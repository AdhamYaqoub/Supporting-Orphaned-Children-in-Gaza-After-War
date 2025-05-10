const Organization = require('../models/Organization');

exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).json(organizations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.organizationId);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching organization' });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    await Organization.update(req.body, {
      where: { id: req.params.organizationId }
    });
    res.status(200).json({ message: 'Organization updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating organization' });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    await Organization.destroy({ where: { id: req.params.organizationId } });
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting organization' });
  }
};
