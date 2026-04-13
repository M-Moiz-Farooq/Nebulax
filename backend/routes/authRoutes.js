const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login } = require('../controllers/authController');
const { handleValidationErrors } = require('../middleware/validate');
const { signupRules, loginRules } = require('../middleware/validators');

const router = express.Router();

/**
 * Stricter rate limit on auth endpoints mitigates online password guessing / credential stuffing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, try again later', code: 'RATE_LIMIT' },
});

router.post('/signup', authLimiter, signupRules, handleValidationErrors, signup);
router.post('/login', authLimiter, loginRules, handleValidationErrors, login);

module.exports = router;
