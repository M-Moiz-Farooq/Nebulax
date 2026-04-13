const { ROLES } = require('../config/constants');

/**
 * allowRoles — role-based access control (RBAC) after authenticate.
 * Fails closed: if role not in allowed list, request is denied (403).
 */
function allowRoles(...allowed) {
  const set = new Set(allowed);
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_USER',
      });
    }
    if (!set.has(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this resource',
        code: 'FORBIDDEN_ROLE',
      });
    }
    next();
  };
}

module.exports = { allowRoles, ROLES };
