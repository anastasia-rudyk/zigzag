import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ukrroute',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: '7d',
  osrmUrl: process.env.OSRM_URL || 'https://router.project-osrm.org',
  osrmTimeoutMs: 5000,
  isProduction: process.env.NODE_ENV === 'production',
};

// Обмеження, які перевіряються під час побудови маршруту
export const limits = {
  maxPoints: 25, // разом зі стартовою точкою
  minDays: 1,
  maxDays: 14,
  maxPeople: 10,
  maxMinutesPerDay: 480, // T_max у формулі (2.8)
};

// Параметри резервного розрахунку відстаней, формула (2.5)
export const geo = {
  earthRadiusKm: 6371,
  roadFactor: 1.3,
  speedKmh: { car: 60, bus: 50 },
};

// Ціни за замовчуванням для формул (2.10)–(2.11).
// Демонстраційні значення: користувач може змінити їх у формі подорожі.
export const defaultPrices = {
  fuelPer100: 8, // л/100 км
  fuelPrice: 55, // грн/л
  busPerKm: 1.5, // грн/км на людину
  nightPrice: 1500, // грн за номер на двох
  foodPerDay: 600, // грн на людину за день
};
