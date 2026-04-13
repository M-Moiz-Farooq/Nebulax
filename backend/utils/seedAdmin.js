const User = require('../models/User');
const { ROLES } = require('../config/constants');

/**
 * Seeds a single ADMIN if none exists — avoids empty production-like installs.
 * Credentials come from env so defaults are not hard-coded in source (still change .env in real use).
 */
async function seedAdminUser() {
  const existing = await User.findOne({ role: ROLES.ADMIN });
  if (existing) return;

  const email = process.env.SEED_ADMIN_EMAIL || 'moizranammf@gmail.com';
  const password = process.env.SEED_ADMIN_PASSWORD || '12345678';

  await User.create({
    email,
    password,
    role: ROLES.ADMIN,
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded ADMIN user: ${email} (change password after first login)`);
}

module.exports = { seedAdminUser };
