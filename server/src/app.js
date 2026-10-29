import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import locationRoutes from './routes/locations.js';
import tripRoutes from './routes/trips.js';
import { errorHandler, notFound } from './middleware/error.js';
import { defaultPrices, limits } from './config/index.js';
import { startCities } from './seed/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Перевірка стану сервера (використовується Docker і хостингом)
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // Довідкові дані для клієнта: стартові міста, ціни та обмеження за замовчуванням
  app.get('/api/meta', (_req, res) => {
    res.json({ startCities, defaultPrices, limits });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api', notFound);

  // У продакшні сервер віддає зібраний клієнт (SPA)
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}
