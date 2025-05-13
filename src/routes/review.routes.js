const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authMiddleware').authorizeRoles;

router.post('/', authMiddleware, authorizeRoles(['donor', 'volunteer']), async (req, res) => {
    try {
        const review = await Review.create({
            ...req.body,
            user_id: req.user.id
        });
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:reviewId', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:reviewId', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await review.update(req.body);
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:reviewId', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await review.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;