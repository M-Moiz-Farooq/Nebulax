const mongoose = require('mongoose');

/**
 * Central error handler — avoids leaking stack traces in production responses
 * while keeping structured JSON for clients (and consistent grading demos).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      code: 'DUPLICATE',
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'MONGOOSE_VALIDATION',
      errors,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier format',
      code: 'CAST_ERROR',
    });
  }

  const status = err.statusCode || err.status || 500;
  const body = {
    success: false,
    message: err.message || 'Internal server error',
    code: err.code || 'SERVER_ERROR',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  return res.status(status).json(body);
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
}

module.exports = { errorHandler, notFoundHandler };
