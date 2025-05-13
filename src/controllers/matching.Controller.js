// controllers/matchingController.js
const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');
const Match = require('../models/Match');

// العثور على المتطوعين المناسبين لطلب معين
async function matchVolunteersToRequest(req, res) {
    const { requestId } = req.params; // تحديد الـ requestId من الرابط
    try {
        // البحث عن الطلب بناءً على requestId
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ message: 'طلب الخدمة غير موجود' });
        }

        // العثور على المتطوعين الذين يقدمون نفس نوع الخدمة المطلوبة
        const volunteers = await Volunteer.findAll({
            where: { service_type: request.service_needed }
        });

        if (volunteers.length === 0) {
            return res.status(404).json({ message: 'لا يوجد متطوعون مناسبون' });
        }

        // تحديث حالة الطلب إلى "matched"
        await request.update({ status: 'matched' });

        return res.status(200).json({
            message: 'تم العثور على المتطوعين المناسبين',
            volunteers: volunteers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'حدث خطأ في النظام' });
    }
}
async function getAllMatches (req, res) {
    try {
      const matches = await Match.findAll({
        include: [Volunteer, Request]
      });
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
module.exports = {
    matchVolunteersToRequest,getAllMatches
};
