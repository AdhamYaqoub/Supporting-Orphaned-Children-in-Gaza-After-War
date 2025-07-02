const {
  DeliveryAssignment,
  Donation,
  Volunteer,
  OrganizationVolunteer,
  Organization,
} = require("../models");

exports.assignVolunteerToDonation = async (req, res) => {
  try {
    const { donationId, volunteerId } = req.body;

    if (req.user.role !== "orphanage") {
      return res.status(403).json({
        error: "Only organizations can assign volunteers to donations.",
      });
    }
    
    const userId = req.user.id;
    const Organization = await Organization.findOne({
      where: { user_id: userId },
      include: {
        model: Volunteer,
        as: "volunteers",
        through: { attributes: [] },
      },
    });

    const donation = await Donation.findOne({
      where: { id: donationId, organization_id: Organization.id },
    });
    if (!donation) {
      return res.status(404).json({
        error: "Donation not found or does not belong to your organization.",
      });
    }

    const orgVolunteer = await OrganizationVolunteer.findOne({
      where: {
        organization_id: Organization.id,
        volunteer_id: volunteerId,
      },
    });

    if (!orgVolunteer) {
      return res
        .status(403)
        .json({ error: "Volunteer does not belong to your organization." });
    }

    const volunteer = await Volunteer.findOne({ where: { id: volunteerId } });
    if (!volunteer || volunteer.service_type !== "delivery") {
      return res
        .status(400)
        .json({ error: "Volunteer does not provide delivery service." });
    }

    const existingAssignment = await DeliveryAssignment.findOne({
      where: { donation_id: donationId },
    });
    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "This donation is already assigned to a volunteer." });
    }

    const assignment = await DeliveryAssignment.create({
      donation_id: donationId,
      volunteer_id: volunteerId,
      assigned_at: new Date(),
      status: "pending",
    });

    res.status(201).json({
      message: "Volunteer assigned to donation successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getMyDeliveryAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const volunteer = await Volunteer.findOne({ where: { user_id: userId } });

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    const assignments = await DeliveryAssignment.findAll({
      where: { volunteer_id: volunteer.id },
      include: [Donation],
    });

    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch delivery assignments" });
  }
};
