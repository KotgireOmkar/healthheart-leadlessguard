import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pharmdmates_db_user:fckUQwcZ59qgqQe3@cluster0.sjdskjp.mongodb.net/healthheart?retryWrites=true&w=majority';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('[MongoDB Atlas] Connection failed:', error);
    return false;
  }
};
