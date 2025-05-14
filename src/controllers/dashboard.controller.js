const { User, Donation } = require("../models");

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const donationCount = await Donation.count();
    const activityCount = 0; 

    res.json({
      stats: {
        userCount,
        donationCount,
        activityCount,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};


exports.getLogs = async (req, res) => {
  try {
    const logs = await Donation.findAll({
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    res.json({ logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Error fetching activity logs" });
  }
};
