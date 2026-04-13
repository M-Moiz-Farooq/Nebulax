/**
 * Run: npm run verify-db
 * Checks .env and tries one MongoDB connection (no server).
 */
require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env'),
  override: true,
});

const mongoose = require('mongoose');
const { resolveMongoUri } = require('../config/db');

async function main() {
  console.log('--- IT6006: database check ---\n');

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('FAIL: JWT_SECRET missing or shorter than 32 characters in .env');
    process.exit(1);
  }
  console.log('OK: JWT_SECRET is set');

  const uri = resolveMongoUri();
  if (!uri) {
    console.error('FAIL: MongoDB not configured.');
    console.error('     Set MONGODB_URI, OR set MONGODB_USER + MONGODB_PASSWORD + MONGODB_CLUSTER_HOST');
    process.exit(1);
  }
  console.log('OK: MongoDB connection string is built (password hidden)');

  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('OK: Connected to MongoDB successfully');
    await mongoose.disconnect();
    console.log('\nYou can run: npm start');
  } catch (e) {
    console.error('FAIL: Could not connect to MongoDB');
    console.error('     Common fixes: wrong host/password, or Atlas Network Access blocks your IP');
    console.error('     Error:', e.message);
    process.exit(1);
  }
}

main();
