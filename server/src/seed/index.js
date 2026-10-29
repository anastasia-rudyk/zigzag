/**
 * Наповнення бази демонстраційними даними.
 *   npm run seed            — оновити категорії й локації, підтягнути фото (з кешу або Commons)
 *   npm run seed -- --refresh-photos — заново запитати всі фото в Wikimedia Commons
 *   npm run seed -- --no-photos      — без фото (наприклад, без інтернету)
 *
 * Локації оновлюються за назвою (upsert), тому їхні id, відгуки та збережені подорожі
 * не втрачаються при повторному запуску.
 */
import { connectDB, disconnectDB } from '../db.js';
import { Category } from '../models/Category.js';
import { Location } from '../models/Location.js';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { categories, locations } from './data.js';
import { loadPhotos } from './photos.js';

const args = new Set(process.argv.slice(2));

async function seed() {
  await connectDB();

  // 1. Категорії — оновлюємо за slug
  const catBySlug = {};
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    catBySlug[c.slug] = doc._id;
  }

  // 2. Фото з Wikimedia Commons
  const photos = args.has('--no-photos')
    ? {}
    : await loadPhotos(locations, { refresh: args.has('--refresh-photos') });

  // 3. Локації — оновлюємо за назвою
  for (const { category, photo: _spec, ...rest } of locations) {
    const p = photos[rest.name];
    const update = { ...rest, categoryId: catBySlug[category] };
    if (p) {
      update.photos = [p.url];
      update.photoCredit = p.credit;
    }
    await Location.findOneAndUpdate({ name: rest.name }, update, { upsert: true, runValidators: true });
  }

  // 4. Прибираємо локації й категорії, яких більше немає в даних
  const names = locations.map((l) => l.name);
  const stale = await Location.find({ name: { $nin: names } }, '_id');
  if (stale.length) {
    await Review.deleteMany({ locationId: { $in: stale.map((s) => s._id) } });
    await Location.deleteMany({ _id: { $in: stale.map((s) => s._id) } });
  }
  await Category.deleteMany({ slug: { $nin: categories.map((c) => c.slug) } });

  // 5. Адміністратор
  const adminEmail = 'admin@zigzag.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: 'Адміністратор',
      email: adminEmail,
      role: 'admin',
      passwordHash: await User.hashPassword(adminPassword),
    });
    console.log(`Створено адміністратора: ${adminEmail} / ${adminPassword}`);
  }

  console.log(
    `Категорій: ${categories.length}, локацій: ${locations.length}` +
      (stale.length ? `, видалено застарілих: ${stale.length}` : '')
  );
  await disconnectDB();
}

seed().catch(async (err) => {
  console.error('Помилка наповнення бази:', err.message);
  await disconnectDB();
  process.exit(1);
});
