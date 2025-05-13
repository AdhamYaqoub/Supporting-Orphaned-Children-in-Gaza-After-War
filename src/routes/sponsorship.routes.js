const express = require('express');
const router = express.Router();
const { Sponsorship } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authMiddleware').authorizeRoles;

router.post('/', authMiddleware, authorizeRoles(['donor']), async (req, res) => {
    try {
        const sponsorship = await Sponsorship.create({
            ...req.body,
            donor_id: req.user.id
        });
        res.status(201).json(sponsorship);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', authMiddleware, authorizeRoles(['admin', 'donor']), async (req, res) => {
    try {
        const where = req.user.role === 'donor' ? { donor_id: req.user.id } : {};
        const sponsorships = await Sponsorship.findAll({ where });
        res.json(sponsorships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.sponsorshipId);
        if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });
        
        if (req.user.role === 'donor' && sponsorship.donor_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        res.json(sponsorship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.sponsorshipId);
        if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

        if (req.user.role === 'donor' && sponsorship.donor_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await sponsorship.update(req.body);
        res.json(sponsorship);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.sponsorshipId);
        if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

        if (req.user.role === 'donor' && sponsorship.donor_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await sponsorship.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;