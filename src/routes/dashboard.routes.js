const express = require("express");
const { User, Donation, ActivityLog } = require("../models"); // تأكد من استيراد الموديلات
const authMiddleware = require("../middleware/auth"); // تأكد من استخدام middleware للتحقق من المصادقة

const router = express.Router();

// ✅ عرض الإحصائيات
router.get("/dashboard/stats", authMiddleware, async (req, res) => {
    try {
        const userCount = await User.count(); // عدد المستخدمين
        console.log('User count:', userCount);

        const donationCount = await Donation.count(); // عدد التبرعات
        console.log('Donation count:', donationCount);

        // استبدال ActivityLog بعدم وجوده
        const activityCount = 0; // إذا كنت لا ترغب في تتبع الأنشطة
        console.log('Activity count:', activityCount);

        res.json({
            stats: {
                userCount,
                donationCount,
                activityCount,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: "Error fetching stats" });
    }
});



// ✅ عرض سجلات الأنشطة
// ✅ عرض سجلات الأنشطة
router.get("/dashboard/logs", authMiddleware, async (req, res) => {
    try {
        // جلب آخر 10 تبرعات من جدول Donations كمثال
        const logs = await Donation.findAll({
            order: [['created_at', 'DESC']], // ترتيب السجلات حسب التاريخ
            limit: 10, // يمكنك تعديل هذا حسب الحاجة
        });

        // إرسال السجلات في الاستجابة
        res.json({ logs });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ error: "Error fetching activity logs" });
    }
});


module.exports = router;
