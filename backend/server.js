// override: true — .env wins over stale MONGODB_URI etc. in Windows system env
require('dotenv').config({ override: true });

const app = require('./app');
const { connectDB } = require('./config/db');
const { seedAdminUser } = require('./utils/seedAdmin');

const PORT = Number(process.env.PORT) || 5000;

/**
 * Boot sequence: validate secrets → DB → optional seed → listen.
 * Failing fast on misconfiguration avoids running a "secure" API with weak defaults.
 */
function validateEnv() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    // eslint-disable-next-line no-console
    console.error('FATAL: JWT_SECRET must be set and at least 32 characters (see .env.example).');
    process.exit(1);
  }
}

async function main() {
  validateEnv();
  await connectDB();
  await seedAdminUser();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IT6006 Finance API listening on port ${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
