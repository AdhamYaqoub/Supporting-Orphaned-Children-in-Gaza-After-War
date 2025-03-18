const express = require('express');
const router = express.Router();
const { Donation } = require('../models');

// Create a donation
router.post('/donations', async (req, res) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all donations
router.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.findAll();
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single donation by ID
router.get('/donations/:donationId', async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a donation
router.put('/donations/:donationId', async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        await donation.update(req.body);
        res.json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a donation
router.delete('/donations/:donationId', async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.donationId);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        await donation.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
