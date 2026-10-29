import mongoose from 'mongoose';
import { config } from './config/index.js';

export async function connectDB(uri = config.mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`MongoDB підключено: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
