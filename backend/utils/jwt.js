const jwt = require('jsonwebtoken');

/**
 * JWT helpers — token signed with server secret; short-lived tokens limit exposure if stolen.
 * Payload holds only non-sensitive identifiers (sub = userId, role for quick checks — role also re-loaded from DB in sensitive ops if needed).
 */
function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };
