const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');
const uthorizeRoles = require('./../middleware/authMiddleware'); // استيراد الميدل وير الخاص بالتحقق من التوكن


// Get all transactions
router.get('/transactions', uthorizeRoles(['admin']),async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single transaction by ID
router.get('/transactions/:transactionId', uthorizeRoles(['admin']),  async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update transaction status
router.put('/transactions/:transactionId',uthorizeRoles(['admin']), async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        await transaction.update({ status: req.body.status });
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete a transaction
router.delete('/transactions/:transactionId', uthorizeRoles(['donor']),async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'transaction not found' });

        if (transaction.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied: Not your donation' });
        }
        await transaction.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
