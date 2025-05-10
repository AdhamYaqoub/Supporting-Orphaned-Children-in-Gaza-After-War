const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.Controller');

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:requestId', requestController.getRequestById);
router.put('/:requestId', requestController.updateRequest);
router.delete('/:requestId', requestController.deleteRequest);

module.exports = router;
