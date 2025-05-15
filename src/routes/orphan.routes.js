const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authMiddleware').authorizeRoles;
const {
    createOrphan,
    getOrphans,
    getOrphanById,
    updateOrphan,
    deleteOrphan
} = require('../controllers/orphanController');

router.post('/', authMiddleware, authorizeRoles(['admin', 'orphanage']), createOrphan);
router.get('/', authMiddleware, getOrphans);
router.get('/:orphanId', authMiddleware, getOrphanById);
router.put('/:orphanId', authMiddleware, authorizeRoles(['admin', 'orphanage']), updateOrphan);
router.delete('/:orphanId', authMiddleware, authorizeRoles(['admin', 'orphanage']), deleteOrphan);

module.exports = router;