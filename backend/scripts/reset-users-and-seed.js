/**
 * School / dev only: deletes all users, transactions, and notes, then creates one ADMIN
 * from SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD in .env
 *
 * Run from backend folder: npm run reset-db
 */
require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env'),
  override: true,
});

const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Note = require('../models/Note');
const { ROLES } = require('../config/constants');

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || '').trim();
  const password = (process.env.SEED_ADMIN_PASSWORD || '').trim();

  if (!email || !password) {
    console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 characters (User schema rule).');
    process.exit(1);
  }

  await connectDB();

  const nNotes = await Note.deleteMany({});
  const nTx = await Transaction.deleteMany({});
  const nUsers = await User.deleteMany({});

  // eslint-disable-next-line no-console
  console.log(`Removed: ${nUsers.deletedCount} users, ${nTx.deletedCount} transactions, ${nNotes.deletedCount} notes.`);

  await User.create({
    email,
    password,
    role: ROLES.ADMIN,
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded ADMIN: ${email}`);
  // eslint-disable-next-line no-console
  console.log('Log in with that email and SEED_ADMIN_PASSWORD from .env');

  await mongoose.disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
