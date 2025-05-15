const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authMiddleware').authorizeRoles;
const {
    createSponsorship,
    getSponsorships,
    getSponsorshipById,
    updateSponsorship,
    deleteSponsorship
} = require('../controllers/sponsorshipController');

router.post('/', authMiddleware, authorizeRoles(['donor']), createSponsorship);
router.get('/', authMiddleware, authorizeRoles(['admin', 'donor']), getSponsorships);
router.get('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), getSponsorshipById);
router.put('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), updateSponsorship);
router.delete('/:sponsorshipId', authMiddleware, authorizeRoles(['admin', 'donor']), deleteSponsorship);

module.exports = router;