const mongoose = require('mongoose');

/**
 * Build connection string: full MONGODB_URI wins; else Atlas-style parts (user + password + cluster host).
 * Passwords with special characters are URL-encoded for the URI.
 */
function resolveMongoUri() {
  const full = process.env.MONGODB_URI?.trim();
  if (full) return full;

  const host = process.env.MONGODB_CLUSTER_HOST?.trim();
  const user = process.env.MONGODB_USER?.trim();
  const pass = process.env.MONGODB_PASSWORD?.trim();
  const db = process.env.MONGODB_DB_NAME?.trim() || 'it6006_finance';

  if (host && user && pass) {
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/${db}?retryWrites=true&w=majority`;
  }

  return null;
}

/**
 * MongoDB connection with safe defaults for academic / small deployments.
 * - Disables auto-index in production builds if you scale out (optional tuning).
 * - Fails fast if URI is missing so we never run without a defined data store.
 */
async function connectDB() {
  const uri = resolveMongoUri();
  if (!uri) {
    throw new Error(
      'MongoDB not configured: set MONGODB_URI, or set MONGODB_CLUSTER_HOST + MONGODB_USER + MONGODB_PASSWORD (see .env.example)'
    );
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // Fail fast if MongoDB is unreachable (clearer for local / classroom setup)
    serverSelectionTimeoutMS: 8000,
  });

  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

module.exports = { connectDB, resolveMongoUri };
