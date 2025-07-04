const { User, Donation } = require("../models");
const { Op } = require("sequelize");

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;


    const donationCount = await Donation.count({
      where: { user_id:userId },
    });


    
    const donationsByCategory = await Donation.findAll({
      where: { user_id:userId },
      attributes: [
        "category",
        [Donation.sequelize.fn("SUM", Donation.sequelize.col("amount")), "totalAmount"],
      ],
      group: ["category"],
    });


    const categorySummary = {};
    donationsByCategory.forEach((entry) => {
      categorySummary[entry.category] = parseFloat(entry.dataValues.totalAmount);
    });

    res.json({
      stats: {
        donationCount,
        donationsByCategory: categorySummary,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const logs = await Donation.findAll({
      where: { user_id:userId },
      order: [["created_at", "DESC"]],
      limit: 10,
      attributes: ["id", "category", "amount", "created_at"],
    });

    res.json({ logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Error fetching activity logs" });
  }
};
