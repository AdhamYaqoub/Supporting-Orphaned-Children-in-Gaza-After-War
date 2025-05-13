const Request = require('../models/Request');
const Match = require('../models/Match');
const Volunteer = require('../models/Volunteer');
const Organization= require('../models/Organization');


exports.createRequest = async (req, res) => {
  try {


    const user_id = req.user.id; // Get the logged-in orphanage's ID
   const organization = await Organization.findOne({
  where: { user_id: user_id }
});
if (!organization) {
  return res.status(404).json({ error: 'Organization not found for this user' });
}
      

    const request = await Request.create({
      ...req.body,
      organization_id: organization.id
    });

    const matchingVolunteers = await Volunteer.findAll({
      where: { service_type: request.service_needed }
    });

    for (const volunteer of matchingVolunteers) {
      await Match.create({ volunteer_id: volunteer.id, request_id: request.id });
    }

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching service request' });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    await Request.update(req.body, {
      where: { id: req.params.requestId }
    });
    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating service request' });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    await Request.destroy({ where: { id: req.params.requestId } });
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting service request' });
  }
};
