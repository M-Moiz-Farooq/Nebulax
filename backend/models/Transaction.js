const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../config/constants');

/**
 * Ledger-style transaction: each record ties to the user who created it
 * for audit trails (who changed the books).
 */
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
