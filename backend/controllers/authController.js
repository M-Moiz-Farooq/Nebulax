const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { ROLES } = require('../config/constants');

/**
 * Auth controller — signup defaults to USER role so privilege escalation
 * cannot happen via public registration.
 */
async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.create({
      email,
      password,
      role: ROLES.USER,
    });

    const token = signToken({ sub: user.id, role: user.role });
    return res.status(201).json({
      success: true,
      message: 'User registered',
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Same message for bad email/password to avoid user enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = signToken({ sub: user.id, role: user.role });
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { signup, login };
