const express = require("express");
const { Notification, User } = require("../models"); // تأكد من استيراد النماذج
const authMiddleware = require("../middleware/auth"); // تأكد من استخدام middleware للتحقق من المصادقة

const router = express.Router();

// ✅ إرسال إشعار
router.post("/notifications", authMiddleware, async (req, res) => {
    try {
        const { message, userId } = req.body; // تأكد من إرسال الرسالة ومعرف المستخدم في الطلب

        // تحقق إذا كان المستخدم موجودًا
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // إنشاء إشعار جديد في جدول Notifications
        const notification = await Notification.create({
            message: message,
            userId: userId, // تأكد من ربط الإشعار بالمستخدم
            read: false, // إذا كانت الإشعار غير مقروء عند إنشائه
        });

        res.status(201).json({ notification });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: "Error sending notification" });
    }
});

// ✅ عرض إشعارات المستخدم
router.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // احصل على ID المستخدم من التوكن (بعد التحقق من المصادقة)

        // جلب إشعارات المستخدم المرتبطة به من جدول Notifications
        const notifications = await Notification.findAll({
            where: { userId: userId },
            order: [['created_at', 'DESC']], // ترتيب الإشعارات حسب تاريخ الإنشاء
        });

        res.json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: "Error fetching notifications" });
    }
});

module.exports = router;
