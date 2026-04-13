const User = require('../models/User');

/**
 * User administration — only ADMIN; listing users is sensitive (privacy / reconnaissance).
 */
async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, data: { users } });
  } catch (e) {
    next(e);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const user = await User.create({ email, password, role });
    return res.status(201).json({
      success: true,
      message: 'User created',
      data: { user: { id: user.id, email: user.email, role: user.role } },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { listUsers, createUser };
