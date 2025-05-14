const { Transaction } = require('../models');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    await transaction.update({ status: req.body.status });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete transaction by donor
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    if (transaction.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: Not your donation' });
    }

    await transaction.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
