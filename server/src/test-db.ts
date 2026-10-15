import { connectDB } from './config/db.js';

async function test() {
  console.log('Testing MongoDB connection...');
  const res = await connectDB();
  console.log('Result:', res);
  process.exit(res ? 0 : 1);
}

test();
