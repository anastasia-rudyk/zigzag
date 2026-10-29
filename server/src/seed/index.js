import { connectDB, disconnectDB } from '../db.js';
import { Category } from '../models/Category.js';
import { Location } from '../models/Location.js';
import { User } from '../models/User.js';
import { categories, locations } from './data.js';

async function seed() {
  await connectDB();

  await Promise.all([Category.deleteMany({}), Location.deleteMany({})]);

  const createdCats = await Category.insertMany(categories);
  const catBySlug = Object.fromEntries(createdCats.map((c) => [c.slug, c._id]));

  await Location.insertMany(
    locations.map(({ category, ...rest }) => ({ ...rest, categoryId: catBySlug[category] }))
  );

  const adminEmail = 'admin@ukrroute.local';
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

  console.log(`Додано категорій: ${createdCats.length}, локацій: ${locations.length}`);
  await disconnectDB();
}

seed().catch(async (err) => {
  console.error('Помилка наповнення бази:', err.message);
  await disconnectDB();
  process.exit(1);
});
