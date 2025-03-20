// yazan 


const express = require("express");
const router = express.Router();
const { EmergencyCampaign, Donation } = require("../models");
const { Op } = require("sequelize");
const { exportToCSV, exportToPDF } = require("../utils/exporter"); // تأكد من وجود هذه الدوال في ملف منفصل

// ----------------------- البحث في البيانات -----------------------

// البحث عبر الكيانات (التبرعات والحملات الطارئة) بناءً على مصطلح البحث
router.get("/search", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Search term is required" });

        // البحث في التبرعات بناءً على الاسم
        const donations = await Donation.findAll({ where: { name: { [Op.like]: `%${query}%` } } });
        
        // البحث في الحملات الطارئة بناءً على العنوان
        const campaigns = await EmergencyCampaign.findAll({ where: { title: { [Op.like]: `%${query}%` } } });

        res.json({ donations, campaigns });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------- تصدير البيانات -----------------------

// تصدير بيانات التبرعات إلى CSV
router.get("/export/csv", async (req, res) => {
    try {
        const donations = await Donation.findAll();
        const csvData = await exportToCSV(donations);
        res.attachment("donations.csv").send(csvData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// تصدير بيانات التبرعات إلى PDF
router.get("/export/pdf", async (req, res) => {
    try {
        const donations = await Donation.findAll();
        const pdfBuffer = await exportToPDF(donations);
        res.contentType("application/pdf").send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
