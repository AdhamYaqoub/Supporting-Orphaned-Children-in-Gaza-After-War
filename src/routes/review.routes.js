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
router.put('/:reviewId',uthorizeRoles(['donor', 'volunteer']), updateReview);
router.delete('/:reviewId',uthorizeRoles(['donor', 'volunteer']), deleteReview);

module.exports = router;
