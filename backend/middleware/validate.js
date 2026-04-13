const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains — returns 422 with field-level errors.
 * 422 = semantic validation failure (understood but invalid input).
 */
function handleValidationErrors(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
    value: e.value,
  }));

  return res.status(422).json({
    success: false,
    message: 'Request validation failed',
    code: 'VALIDATION_ERROR',
    errors,
  });
}

module.exports = { handleValidationErrors };
