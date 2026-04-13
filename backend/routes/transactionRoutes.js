const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowRoles, ROLES } = require('../middleware/role');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { handleValidationErrors } = require('../middleware/validate');
const {
  mongoIdParam,
  transactionBodyRules,
  transactionUpdateRules,
} = require('../middleware/validators');

const router = express.Router();

router.use(authenticate);

// All authenticated roles may list (USER is scoped in controller)
router.get('/', getTransactions);

router.post(
  '/',
  allowRoles(ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER),
  transactionBodyRules,
  handleValidationErrors,
  createTransaction
);

router.put(
  '/:id',
  allowRoles(ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER),
  mongoIdParam,
  transactionUpdateRules,
  handleValidationErrors,
  updateTransaction
);

router.delete(
  '/:id',
  allowRoles(ROLES.ADMIN),
  mongoIdParam,
  handleValidationErrors,
  deleteTransaction
);

module.exports = router;
