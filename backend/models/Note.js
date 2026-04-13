const mongoose = require('mongoose');
const { NOTE_TYPES } = require('../config/constants');

/**
 * Credit / debit notes — formal adjustments separate from generic transactions
 * (common in accounting: credit note reduces receivable, debit note increases it).
 */
const noteSchema = new mongoose.Schema(
  {
    noteType: {
      type: String,
      enum: Object.values(NOTE_TYPES),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
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
    reference: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
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

module.exports = mongoose.model('Note', noteSchema);
