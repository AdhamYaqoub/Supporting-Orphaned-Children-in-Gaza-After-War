const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uthorizeRoles = require('./../middleware/authMiddleware'); 
const {
    createOrphan,
    getOrphans,
    getOrphanById,
    updateOrphan,
    deleteOrphan
} = require('../controllers/orphan.controller');

router.post('/', authMiddleware, uthorizeRoles(['admin', 'orphanage']), createOrphan);
router.get('/', authMiddleware, getOrphans);
router.get('/:orphanId', authMiddleware, getOrphanById);
router.put('/:orphanId', authMiddleware, uthorizeRoles(['admin', 'orphanage']), updateOrphan);
router.delete('/:orphanId', authMiddleware, uthorizeRoles(['admin', 'orphanage']), deleteOrphan);

module.exports = router;