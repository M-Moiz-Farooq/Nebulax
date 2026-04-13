const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

/**
 * Express application factory.
 * Security middleware order matters: helmet first (headers), then parsers, then sanitization
 * before route handlers touch user-controlled input.
 */
const app = express();

// Sets secure HTTP headers (XSS filter, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// Restrict CORS in production by replacing * with your front-end origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Global API rate limit — broad protection against abuse / DoS at application layer
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests', code: 'RATE_LIMIT' },
});
app.use('/api', globalLimiter);

// Cap JSON payload size to reduce memory exhaustion risk
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

/**
 * express-mongo-sanitize removes keys that start with $ or contain .
 * from user-supplied objects — mitigates NoSQL injection via operators in queries.
 */
app.use(mongoSanitize({ replaceWith: '_' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
