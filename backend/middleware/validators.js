const { body, param } = require('express-validator');
const { ROLES, TRANSACTION_TYPES } = require('../config/constants');

/**
 * express-validator chains — server-side validation is mandatory:
 * never trust client input; prevents bad data and many injection-style abuses.
 */

const signupRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const createUserRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
];

const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid transaction id'),
];

const transactionBodyRules = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('type')
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(`Type must be credit or debit`),
  body('description')
    .trim()
    .notEmpty()
    .isLength({ max: 2000 })
    .withMessage('Description is required (max 2000 chars)'),
  body('date').optional().isISO8601().withMessage('date must be ISO 8601'),
];

const creditNoteRules = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('description')
    .trim()
    .notEmpty()
    .isLength({ max: 2000 })
    .withMessage('Description is required'),
  body('date').optional().isISO8601().withMessage('date must be ISO 8601'),
  body('reference').optional().trim().isLength({ max: 100 }),
];

const debitNoteRules = creditNoteRules;

const transactionUpdateRules = [
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage('Type must be credit or debit'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 2000 })
    .withMessage('Description cannot be empty'),
  body('date').optional().isISO8601().withMessage('date must be ISO 8601'),
];

module.exports = {
  signupRules,
  loginRules,
  createUserRules,
  mongoIdParam,
  transactionBodyRules,
  creditNoteRules,
  debitNoteRules,
  transactionUpdateRules,
};
