const { Review } = require('../models');

exports.createReview = async (req, res) => {
    try {
        const review = await Review.create({ ...req.body, user_id: req.user.id });
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        if (review.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await