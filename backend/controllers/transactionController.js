const Transaction = require('../models/Transaction');
const { ROLES } = require('../config/constants');

/**
 * Transaction access rules:
 * - USER: sees own rows only; may create and update own rows (not delete).
 * - ACCOUNTANT / ADMIN: full read; create/update any; delete only ADMIN (route-level).
 */
function listFilter(req) {
  if (req.user.role === ROLES.USER) {
    return { user: req.user._id };
  }
  return {};
}

async function getTransactions(req, res, next) {
  try {
    const filter = listFilter(req);
    const transactions = await Transaction.find(filter)
      .populate('user', 'email role')
      .sort({ date: -1 });
    return res.json({ success: true, data: { transactions } });
  } catch (e) {
    next(e);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { amount, type, description, date } = req.body;
    const doc = await Transaction.create({
      amount,
      type,
      description,
      date: date || new Date(),
      user: req.user._id,
    });
    const populated = await doc.populate('user', 'email role');
    return res.status(201).json({
      success: true,
      message: 'Transaction created',
      data: { transaction: populated },
    });
  } catch (e) {
    next(e);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const { amount, type, description, date } = req.body;

    const tx = await Transaction.findById(id);
    if (!tx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
        code: 'NOT_FOUND',
      });
    }

    if (req.user.role === ROLES.USER && !tx.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own transactions',
        code: 'FORBIDDEN_ROLE',
      });
    }

    if (amount !== undefined) tx.amount = amount;
    if (type !== undefined) tx.type = type;
    if (description !== undefined) tx.description = description;
    if (date !== undefined) tx.date = date;

    await tx.save();
    const populated = await tx.populate('user', 'email role');
    return res.json({
      success: true,
      message: 'Transaction updated',
      data: { transaction: populated },
    });
  } catch (e) {
    next(e);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndDelete(id);
    if (!tx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
        code: 'NOT_FOUND',
      });
    }
    return res.json({ success: true, message: 'Transaction deleted' });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
