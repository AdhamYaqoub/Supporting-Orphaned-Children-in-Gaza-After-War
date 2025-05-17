const { Sponsorship } = require('../models');

exports.createSponsorship = async (req, res) => {
    try {
        const sponsorship = await Sponsorship.create({ ...req.body, donor_id: req.user.id });
        res.status(201).json(sponsorship);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSponsorships = async (req, res) => {
    try {
        const where = req.user.role === 'donor' ? { donor_id: req.user.id } : {};
        const sponsorships = await Sponsorship.findAll({ where });
        res.json(sponsorships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSponsorshipById = async (req, res) => {
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
};

exports.updateSponsorship = async (req, res) => {
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
};

exports.deleteSponsorship = async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.sponsorshipId);
        if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });
        if (req.user.role === 'donor' && sponsorship.donor_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await sponsorship.destroy();
        res.json({ message: 'Sponsorship deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
