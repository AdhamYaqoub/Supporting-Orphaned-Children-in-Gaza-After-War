const Volunteer = require("../models/Volunteer");
const Request = require("../models/Request");
const Organization = require("../models/Organization");

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
};


exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.volunteerId);
    if (!volunteer)
      return res.status(404).json({ error: "Volunteer not found" });
    res.status(200).json(volunteer);
  } catch (err) {
    res.status(500).json({ error: "Error fetching volunteer" });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const userId = req.user.id;

    const volunteer = await Volunteer.findOne({ where: { user_id: userId } });
    if (!volunteer) {
      return res
        .status(404)
        .json({ error: "Volunteer not found for this user" });
    }

    const volunteerId = volunteer.id;

    await Volunteer.update(req.body, {
      where: { id: volunteerId },
    });

    res.status(200).json({ message: "Volunteer updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating volunteer" });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.destroy({ where: { id: req.params.volunteerId } });
    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting volunteer" });
  }
};



exports.getMyVolunteers = async (req, res) => {
  try {
    const userId = req.user.id;

    const organization = await Organization.findOne({
      where: { user_id: userId },
      include: {
        model: Volunteer,
        as: "volunteers",
        through: { attributes: [] },
      },
    });

    if (!organization) {
      return res.status(404).json({ error: "Your organization not found" });
    }

    res.status(200).json(organization.volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch your volunteers" });
  }
};
