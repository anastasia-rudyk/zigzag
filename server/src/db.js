import dns from 'node:dns';
import mongoose from 'mongoose';
import { config } from './config/index.js';

// Адреса mongodb+srv:// потребує DNS-запиту типу SRV. На деяких мережах (часто на Windows)
// DNS-сервер роутера такі запити відхиляє — тоді можна вказати публічні DNS у DNS_SERVERS.
const dnsServers = (process.env.DNS_SERVERS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers.length) dns.setServers(dnsServers);

export async function connectDB(uri = config.mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`MongoDB підключено: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
