const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');
const Match = require('../models/Match');

exports.createVolunteer = async (req, res) => {
  const volunteer = await Volunteer.create(req.body);

  const matchingRequests = await Request.findAll({
    where: { service_needed: volunteer.service_type, status: 'pending' }
  });

  for (const request of matchingRequests) {
    await Match.create({ volunteer_id: volunteer.id, request_id: request.id });
  }

  res.status(201).json(volunteer);
};


exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
};

exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.volunteerId);
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.status(200).json(volunteer);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching volunteer' });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const updated = await Volunteer.update(req.body, {
      where: { id: req.params.volunteerId }
    });
    res.status(200).json({ message: 'Volunteer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating volunteer' });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.destroy({ where: { id: req.params.volunteerId } });
    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting volunteer' });
  }
};
