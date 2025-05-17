const Request = require("../models/Request");
const VolunteerApplication = require("../models/VolunteerApplication");
const Volunteer = require("../models/Volunteer");
const Organization = require("../models/Organization");
const { Op } = require("sequelize");

exports.createRequest = async (req, res) => {
  try {
    const user_id = req.user.id;
    const organization = await Organization.findOne({
      where: { user_id: user_id },
    });
    if (!organization) {
      return res
        .status(404)
        .json({ error: "Organization not found for this user" });
    }
    const request = await Request.create({
      ...req.body,
      organization_id: organization.id,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create request" });
  }
};

exports.getRequestsByOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: { user_id: req.user.id },
    });
    if (!organization) {
      return res
        .status(403)
        .json({ error: "Organization not found for this user" });
    }
    const requests = await Request.findAll({
      where: { organization_id: organization.id },
    });

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error getting organization requests:", err);
    res.status(500).json({ error: "Failed to fetch organization requests" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
};

exports.getMatchingRequests = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === "volunteer") {
      const volunteer = await Volunteer.findOne({ where: { user_id: userId } });

      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer profile not found" });
      }

      // استبعاد الطلبات التي تقدم عليها بالفعل
      const appliedRequestIds = await VolunteerApplication.findAll({
        where: { volunteer_id: volunteer.id },
        attributes: ["request_id"],
      }).then((matches) => matches.map((m) => m.request_id));

      // جلب الطلبات المتوافقة مع نوع خدمة المتطوع ولم يقدم عليها بعد
      const matchingRequests = await Request.findAll({
        where: {
          service_needed: volunteer.service_type,
          status: "pending",
          id: { [Op.notIn]: appliedRequestIds }, // استبعاد الطلبات المقدمة
        },
      });

      return res.status(200).json(matchingRequests);
    }

    // لو المستخدم مش متطوع، يرجع كل الطلبات (مثلاً في حالة admin)
    const allRequests = await Request.findAll();
    res.status(200).json(allRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: "Error fetching service request" });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const existingRequest = await Request.findByPk(requestId);
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    const organization = await Organization.findOne({
      where: { user_id: req.user.id },
    });
    if (!organization) {
      return res
        .status(403)
        .json({ error: "Organization not found for this user" });
    }

    if (existingRequest.organization_id !== organization.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this request" });
    }

    await Request.update(req.body, { where: { id: requestId } });

    res.status(200).json({ message: "Request updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating service request" });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const existingRequest = await Request.findByPk(requestId);
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    const organization = await Organization.findOne({
      where: { user_id: req.user.id },
    });
    if (!organization) {
      return res
        .status(403)
        .json({ error: "Organization not found for this user" });
    }

    if (existingRequest.organization_id !== organization.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this request" });
    }

    await Request.destroy({ where: { id: requestId } });
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting service request" });
  }
};
