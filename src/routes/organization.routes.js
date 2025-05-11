const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization.Controller');
const uthorizeRoles = require('./../middleware/authMiddleware'); 

router.get('/',uthorizeRoles(['admin','donor','volunteer']), organizationController.getAllOrganizations);//
router.get('/:organizationId',uthorizeRoles(['admin','donor','volunteer']), organizationController.getOrganizationById);//
router.put('/:organizationId',uthorizeRoles(['admin', 'orphanage']), organizationController.updateOrganization);//
router.delete('/:organizationId',uthorizeRoles(['admin']), organizationController.deleteOrganization);//

module.exports = router;
