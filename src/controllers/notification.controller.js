const { Notification, User } = require("../models");

exports.sendNotification = async (req, res) => {
  try {
    const { message, userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const notification = await Notification.create({
      message,
      userId,
      read: false,
    });

    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Error sending notification" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["created_at", "DESC"]],
    });

    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

