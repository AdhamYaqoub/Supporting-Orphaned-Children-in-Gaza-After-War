const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');


// Create a transactions
router.post('/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all transactions
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single transaction by ID
router.get('/transactions/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update transaction status
router.put('/transactions/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        await transaction.update({ status: req.body.status });
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete a donation
router.delete('/transactions/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.transactionId);
        if (!transaction) return res.status(404).json({ error: 'transaction not found' });
        await transaction.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
