const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowRoles, ROLES } = require('../middleware/role');
const { createCreditNote, createDebitNote } = require('../controllers/noteController');
const { handleValidationErrors } = require('../middleware/validate');
const { creditNoteRules, debitNoteRules } = require('../middleware/validators');

const router = express.Router();

router.use(authenticate, allowRoles(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.post('/credit', creditNoteRules, handleValidationErrors, createCreditNote);
router.post('/debit', debitNoteRules, handleValidationErrors, createDebitNote);

module.exports = router;
