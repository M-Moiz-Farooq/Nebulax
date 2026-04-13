/**
 * Application constants — central place for roles and shared enums.
 * Using enums avoids magic strings and keeps authorisation logic consistent.
 */

const ROLES = {
  ADMIN: 'ADMIN',
  ACCOUNTANT: 'ACCOUNTANT',
  USER: 'USER',
};

const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
};

const NOTE_TYPES = {
  CREDIT: 'credit_note',
  DEBIT: 'debit_note',
};

module.exports = {
  ROLES,
  TRANSACTION_TYPES,
  NOTE_TYPES,
};
