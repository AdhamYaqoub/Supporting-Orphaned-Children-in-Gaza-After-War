const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uthorizeRoles = require('./../middleware/authMiddleware'); 
const {
    createSponsorship,
    getSponsorships,
    getSponsorshipById,
    updateSponsorship,
    deleteSponsorship
} = require('../controllers/sponsorship.controller');

router.post('/', authMiddleware, uthorizeRoles(['donor']), createSponsorship);
router.get('/', authMiddleware, uthorizeRoles(['admin', 'donor']), getSponsorships);
router.get('/:sponsorshipId', authMiddleware, uthorizeRoles(['admin', 'donor']), getSponsorshipById);
router.put('/:sponsorshipId', authMiddleware, uthorizeRoles(['admin', 'donor']), updateSponsorship);
router.delete('/:sponsorshipId', authMiddleware, uthorizeRoles(['admin', 'donor']), deleteSponsorship);

module.exports = router;