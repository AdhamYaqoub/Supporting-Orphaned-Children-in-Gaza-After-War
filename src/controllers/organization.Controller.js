const Organization = require('../models/Organization');

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


exports.updateOrganization= async (req, res) => {
  const { organizationId } = req.params;
  const { name_orphanage, address, phone_number, contact_email, verified } = req.body;
  
  try {
    if (req.user.role === 'admin') {
      const updatedOrg = await Organization.update(
        { name_orphanage, address, phone_number, contact_email, verified },
        { where: { id: organizationId } }
      );
      return res.status(200).json({ message: 'Organization updated successfully', updatedOrg });
    }

    if (req.user.role === 'orphanage') {
      const organization = await Organization.findByPk(organizationId);

      if (organization.user_id !== req.user.id) {
        return res.status(403).json({ message: 'You can only update your own organization' });
      }

      const updatedOrg = await Organization.update(
        { name_orphanage, address, phone_number, contact_email },
        { where: { id: organizationId, user_id: req.user.id } } 
      );
      return res.status(200).json({ message: 'Organization updated successfully', updatedOrg });
    }

    return res.status(403).json({ message: 'Unauthorized' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
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
