const Request = require('../models/Request');
const Match = require('../models/Match');


exports.createRequest = async (req, res) => {
    const request = await Request.create(req.body);
  
    const matchingVolunteers = await Volunteer.findAll({
      where: { service_type: request.service_needed }
    });
  
    for (const volunteer of matchingVolunteers) {
      await Match.create({ volunteer_id: volunteer.id, request_id: request.id });
    }
  
    res.status(201).json(request);
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
