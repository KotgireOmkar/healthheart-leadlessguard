import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

async function main() {
  const connected = await connectDB();
  if (connected) {
    await seedDatabase(true); // force refresh with de-identified records
    console.log('[Seed Completed Successfully: De-identified cohort active]');
  } else {
    console.error('[Seed Failed] Unable to connect to MongoDB');
  }
  process.exit(0);
}

main();
