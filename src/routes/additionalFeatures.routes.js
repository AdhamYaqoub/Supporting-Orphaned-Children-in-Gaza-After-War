// yazan 
const express = require("express");
const router = express.Router();
const { EmergencyCampaign, Donation, Organization } = require("../models");
const { Op } = require("sequelize");
const { exportToCSV, exportToPDF } = require("../utils/exporter");
const uthorizeRoles = require('./../middleware/authMiddleware'); // استيراد الميدل وير الخاص بالتحقق من التوكن
// تأكد من وجود هذه الدوال في ملف منفصل

// ----------------------- البحث في البيانات -----------------------

// البحث عبر الكيانات (التبرعات والحملات الطارئة) بناءً على مصطلح البحث
// البحث عبر الكيانات (التبرعات والحملات الطارئة) بناءً على مصطلح البحث
router.get("/search", uthorizeRoles(['admin', 'orphanage']), async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Search term is required" });

        let donations, campaigns;

        if (req.user.role === 'admin') {
            // الإداري يشوف كل شيء
            donations = await Donation.findAll({ where: { name: { [Op.like]: `%${query}%` } } });
            campaigns = await EmergencyCampaign.findAll({ where: { title: { [Op.like]: `%${query}%` } } });
        } else if (req.user.role === 'orphanage') {
            const organization = await Organization.findOne({ where: { user_id: req.user.id } });
            if (!organization) {
                return res.status(404).json({ error: "Organization not found" });
            }
                const organizationId = organization.id;
            // دار الأيتام يشوف فقط التبرعات والحملات التابعة له
            donations = await Donation.findAll({ 
                where: { 
                    name: { [Op.like]: `%${query}%` },
                    organization_id: organizationId
                }
            });

            campaigns = await EmergencyCampaign.findAll({ 
                where: { 
                    title: { [Op.like]: `%${query}%` },
                    organization_id: organizationId
                }
            });
        }

        res.json({ donations, campaigns });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ----------------------- تصدير البيانات -----------------------

// تصدير بيانات التبرعات إلى CSV
router.get("/export/csv", uthorizeRoles(['admin', 'orphanage']), async (req, res) => {
    try {
        let donations;

        if (req.user.role === 'admin') {
            // الإداري يستطيع تصدير جميع التبرعات
            donations = await Donation.findAll();
        } else if (req.user.role === 'orphanage') {
            // دار الأيتام يستطيع تصدير التبرعات التابعة لها فقط
            const organization = await Organization.findOne({ where: { user_id: req.user.id } });

            if (!organization) {
                return res.status(404).json({ error: "Organization not found" });
            }

            const organizationId = organization.id;

            donations = await Donation.findAll({ where: { organization_id: organizationId } });
        }

        const csvData = await exportToCSV(donations);
        res.attachment("donations.csv").send(csvData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// تصدير بيانات التبرعات إلى PDF
router.get("/export/pdf", uthorizeRoles(['admin', 'orphanage']), async (req, res) => {
    try {
        let donations;

        if (req.user.role === 'admin') {
            // الإداري يستطيع تصدير جميع التبرعات
            donations = await Donation.findAll();
        } else if (req.user.role === 'orphanage') {
            // دار الأيتام يستطيع تصدير التبرعات التابعة لها فقط
            const organization = await Organization.findOne({ where: { user_id: req.user.id } });

            if (!organization) {
                return res.status(404).json({ error: "Organization not found" });
            }

            const organizationId = organization.id;

            donations = await Donation.findAll({ where: { organization_id: organizationId } });
        }

        const pdfBuffer = await exportToPDF(donations);
        res.contentType("application/pdf").send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
