const Volunteer = require("../models/Volunteer");
const Request = require("../models/Request");
const VolunteerApplication = require("../models/VolunteerApplication");

async function matchVolunteersToRequest(req, res) {
  const { requestId } = req.params; 
  try {
    const request = await Request.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "طلب الخدمة غير موجود" });
    }

    const volunteers = await Volunteer.findAll({
      where: { service_type: request.service_needed },
    });

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "لا يوجد متطوعون مناسبون" });
    }

    
    await request.update({ status: "matched" });

    return res.status(200).json({
      message: "تم العثور على المتطوعين المناسبين",
      volunteers: volunteers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "حدث خطأ في النظام" });
  }
}
async function getAllMatches(req, res) {
  try {
    const matches = await Match.findAll({
      include: [Volunteer, Request],
    });
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
exports.applyToRequest = async (req, res) => {
  const { volunteer_id, request_id } = req.body;

  const existing = await Match.findOne({ where: { volunteer_id, request_id } });
  if (existing) {
    return res.status(400).json({ message: "Already applied." });
  }

  const match = await Match.create({ volunteer_id, request_id });
  res.status(201).json(match);
};

module.exports = {
  matchVolunteersToRequest,
  getAllMatches,
};
