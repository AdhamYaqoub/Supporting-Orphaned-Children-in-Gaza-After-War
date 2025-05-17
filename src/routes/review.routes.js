const express = require('express');
const router = express.Router();
const uthorizeRoles = require('./../middleware/authMiddleware'); 
const {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
} = require('../controllers/reviews.controller');

router.post('/', uthorizeRoles(['donor', 'volunteer']), createReview);
router.get('/', getReviews);
router.get('/:reviewId', getReviewById);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

module.exports = router;
