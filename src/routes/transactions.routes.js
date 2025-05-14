// transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const uthorizeRoles = require('./../middleware/authMiddleware');

// Get all transactions
router.get('/transactions', uthorizeRoles(['admin']), transactionController.getAllTransactions);

// Get transaction by ID
router.get('/transactions/:transactionId', uthorizeRoles(['admin']), transactionController.getTransactionById);

// Update transaction status
router.put('/transactions/:transactionId', uthorizeRoles(['admin']), transactionController.updateTransactionStatus);

// Delete transaction by donor
router.delete('/transactions/:transactionId', uthorizeRoles(['donor']), transactionController.deleteTransaction);

module.exports = router;
