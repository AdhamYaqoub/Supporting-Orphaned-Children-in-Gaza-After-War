const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authMiddleware').authorizeRoles;
const {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

router.post('/', authMiddleware, authorizeRoles(['donor', 'volunteer']), createReview);
router.get('/', authMiddleware, getReviews);
router.get('/:reviewId', authMiddleware, getReviewById);
router.put('/:reviewId', authMiddleware, updateReview);
router.delete('/:reviewId', authMiddleware, deleteReview);

module.exports = router;