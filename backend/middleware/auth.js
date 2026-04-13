const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

/**
 * authenticate — verifies JWT and attaches req.user (without password).
 * Stateless JWT: signature + expiry checked here on every protected route.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_TOKEN',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
        code: 'USER_GONE',
      });
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { authenticate };
