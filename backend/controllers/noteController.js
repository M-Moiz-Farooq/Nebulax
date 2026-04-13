const Note = require('../models/Note');
const { NOTE_TYPES } = require('../config/constants');

/**
 * Credit / debit notes — issued by privileged staff; tied to creator for audit.
 */
async function createCreditNote(req, res, next) {
  try {
    const { amount, description, date, reference } = req.body;
    const note = await Note.create({
      noteType: NOTE_TYPES.CREDIT,
      amount,
      description,
      date: date || new Date(),
      reference: reference || '',
      user: req.user._id,
    });
    const populated = await note.populate('user', 'email role');
    return res.status(201).json({
      success: true,
      message: 'Credit note created',
      data: { note: populated },
    });
  } catch (e) {
    next(e);
  }
}

async function createDebitNote(req, res, next) {
  try {
    const { amount, description, date, reference } = req.body;
    const note = await Note.create({
      noteType: NOTE_TYPES.DEBIT,
      amount,
      description,
      date: date || new Date(),
      reference: reference || '',
      user: req.user._id,
    });
    const populated = await note.populate('user', 'email role');
    return res.status(201).json({
      success: true,
      message: 'Debit note created',
      data: { note: populated },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { createCreditNote, createDebitNote };
