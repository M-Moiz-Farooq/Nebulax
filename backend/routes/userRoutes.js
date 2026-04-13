const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowRoles, ROLES } = require('../middleware/role');
const { listUsers, createUser } = require('../controllers/userController');
const { handleValidationErrors } = require('../middleware/validate');
const { createUserRules } = require('../middleware/validators');

const router = express.Router();

router.use(authenticate, allowRoles(ROLES.ADMIN));

router.get('/', listUsers);
router.post('/', createUserRules, handleValidationErrors, createUser);

module.exports = router;
