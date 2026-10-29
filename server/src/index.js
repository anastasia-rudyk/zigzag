import { config } from './config/index.js';
import { connectDB } from './db.js';
import { createApp } from './app.js';

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Zigzag API працює на http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error('Не вдалося запустити сервер:', err.message);
  process.exit(1);
});
