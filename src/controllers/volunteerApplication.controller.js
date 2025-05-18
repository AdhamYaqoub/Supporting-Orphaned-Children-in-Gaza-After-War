const Volunteer = require("../models/Volunteer");
const VolunteerApplication = require("../models/VolunteerApplication");
const Request = require("../models/Request");
const Organization = require("../models/Organization");
const User = require("../models/User");
const OrganizationVolunteer = require("../models/OrganizationVolunteer"); // استورد الموديل

exports.applyToRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { request_id, message } = req.body;

    // الحصول على ملف المتطوع
    const volunteer = await Volunteer.findOne({ where: { user_id: userId } });
    if (!volunteer) {
      return res
        .status(404)
        .json({ message: "لم يتم العثور على ملف المتطوع." });
    }

    // الحصول على الطلب
    const request = await Request.findOne({ where: { id: request_id } });
    if (!request) {
      return res.status(404).json({ message: "الطلب غير موجود." });
    }

    // التحقق من توافق نوع الخدمة
    if (request.service_needed !== volunteer.service_type) {
      return res.status(400).json({
        message: "لا يمكنك التقديم على هذا الطلب لأنه لا يتوافق مع نوع خدمتك.",
      });
    }

    // التأكد من عدم التقديم المسبق
    const existingApplication = await VolunteerApplication.findOne({
      where: {
        volunteer_id: volunteer.id,
        request_id: request.id,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: "لقد تقدمت لهذا الطلب مسبقًا." });
    }

    // إنشاء التقديم مع الرسالة فقط
    await VolunteerApplication.create({
      volunteer_id: volunteer.id,
      request_id: request.id,
      message: message || null,
      status: "pending",
    });

    return res.status(201).json({ message: "تم التقديم بنجاح." });
  } catch (error) {
    console.error("Error applying to request:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء التقديم.", error });
  }
};

exports.getApplicationsForMyRequests = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: { user_id: req.user.id },
    });
    if (!organization) {
      return res
        .status(403)
        .json({ error: "Organization not found for this user" });
    }

    const myRequests = await Request.findAll({
      where: { organization_id: organization.id },
      attributes: ["id"],
    });

    const requestIds = myRequests.map((r) => r.id);

    const applications = await VolunteerApplication.findAll({
      where: { request_id: requestIds },
      include: [
        {
          model: Request,
          as: "matchedRequest",
          attributes: ["title"],
        },
        {
          model: Volunteer,
          as: "volunteerInfo",
          attributes: ["full_name"],
          include: [
            {
              model: User,
              as: "associatedUser",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const organization = await Organization.findOne({
      where: { user_id: req.user.id },
    });

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const application = await VolunteerApplication.findByPk(applicationId, {
      include: [{ model: Request, as: "matchedRequest" }],
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.matchedRequest.organization_id !== organization.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    if (status === "accepted") {
      // إضافة المتطوع إلى جدول OrganizationVolunteer
      await OrganizationVolunteer.create({
        organization_id: organization.id,
        volunteer_id: application.volunteer_id,
      });

      // التحقق من اكتمال عدد المتطوعين
      const acceptedCount = await VolunteerApplication.count({
        where: {
          request_id: application.request_id,
          status: "accepted",
        },
      });

      if (acceptedCount >= application.matchedRequest.required_volunteers) {
        application.matchedRequest.status = "completed";
        await application.matchedRequest.save();
      }
    }

    res.status(200).json({ message: `Application ${status} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating application status" });
  }
};
