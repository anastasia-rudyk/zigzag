# UkrRoute

Веб-орієнтована інформаційна система пошуку та планування туристичних подорожей Україною.

Курсова робота з дисципліни «Веб-технології та веб-дизайн», НУ «Львівська політехніка», кафедра АСУ.
Виконала: Анастасія Рудик, група ОІ-23.

Користувач обирає туристичні локації в каталозі або на карті, а система будує оптимальний порядок
їх відвідування (алгоритм найближчого сусіда + локальний пошук 2-opt та Or-opt), розбиває маршрут
по днях і розраховує бюджет подорожі.

## Технології

| Рівень | Технології |
| --- | --- |
| Фронтенд | React 18, Vite, React Router, Leaflet (react-leaflet) |
| Верстка | Tailwind CSS, Flexbox і Grid, адаптивний дизайн |
| Бекенд | Node.js 22, Express, JWT, bcrypt |
| База даних | MongoDB Atlas (хмарна), Mongoose |
| Маршрутизація | OSRM Table API та Route API, резервний розрахунок за гаверсинусом |
| Збірка й розгортання | npm-скрипти, Docker, docker compose, GitHub Actions |

## Структура проєкту

```
ukrroute/
├── client/                 # React-застосунок
│   └── src/
│       ├── api/            # HTTP-клієнт і хук useAsync
│       ├── components/     # Перевикористовувані компоненти (LocationCard, MapView, RouteRibbon…)
│       ├── context/        # Стан авторизації та обраних локацій
│       ├── pages/          # Сторінки застосунку
│       └── utils/          # Форматування чисел, часу, валюти
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # Налаштування, ліміти, ціни за замовчуванням
│   │   ├── middleware/     # Авторизація, обробка помилок
│   │   ├── models/         # Схеми Mongoose: User, Category, Location, Trip
│   │   ├── routes/         # REST-маршрути /api/*
│   │   ├── services/       # Алгоритми: geo, osrm, routeService, planService, tripBuilder
│   │   └── seed/           # Демонстраційні дані
│   ├── scripts/benchmark.js
│   └── test/               # Модульні тести (node:test)
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Запуск локально (macOS)

Потрібні Node.js 20+ (`brew install node`) та база MongoDB: безкоштовний кластер MongoDB Atlas
або локальна (`brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`).

```bash
# 1. Встановити залежності кореня, сервера й клієнта
npm run install:all

# 2. Налаштувати змінні середовища
cp server/.env.example server/.env
# відкрийте server/.env і вкажіть MONGODB_URI та JWT_SECRET

# 3. Заповнити базу демонстраційними даними (24 локації, 4 категорії, адміністратор)
npm run seed

# 4. Запустити сервер (порт 5000) і клієнт (порт 5173) одночасно
npm run dev
```

Відкрийте http://localhost:5173. Адміністратор за замовчуванням: `admin@ukrroute.local` / `admin12345`
(пароль задається змінною `SEED_ADMIN_PASSWORD`).

## Продакшн-збірка

```bash
npm run build   # збирає клієнт у client/dist
npm start       # сервер віддає API та зібраний клієнт на http://localhost:5000
```

## Запуск у Docker

```bash
docker compose up --build -d
docker compose exec app node server/src/seed/index.js   # перше наповнення бази
```

Застосунок буде доступний на http://localhost:5000.

## Тести та порівняння алгоритмів

```bash
npm test          # 16 модульних тестів: гаверсинус, NN, 2-opt, Or-opt, розбивка по днях, бюджет
npm run benchmark # таблиця якості й швидкості алгоритмів для розділу 3.4
```

## API

| Метод | Шлях | Опис | Доступ |
| --- | --- | --- | --- |
| GET | /api/health | Стан сервера та БД | усі |
| GET | /api/meta | Стартові міста, ціни та ліміти за замовчуванням | усі |
| POST | /api/auth/register | Реєстрація | усі |
| POST | /api/auth/login | Вхід, повертає JWT | усі |
| GET | /api/auth/me | Поточний користувач | авторизовані |
| POST | /api/auth/favorites/:id | Додати або прибрати з обраного | авторизовані |
| GET | /api/categories | Категорії | усі |
| GET | /api/locations | Каталог із фільтрами `q`, `region`, `category`, `maxPrice`, `sort` | усі |
| GET | /api/locations/regions | Перелік областей | усі |
| GET | /api/locations/:id | Локація | усі |
| POST, PUT, DELETE | /api/locations[/:id] | Керування локаціями | адміністратор |
| POST, PUT, DELETE | /api/categories[/:id] | Керування категоріями | адміністратор |
| POST | /api/trips/build | Побудувати маршрут без збереження | авторизовані |
| GET, POST | /api/trips | Список подорожей / зберегти подорож | авторизовані |
| GET, PATCH, DELETE | /api/trips/:id | Подорож / перейменувати / видалити | власник |

## Примітки

- Ціни вхідних квитків і ціни за замовчуванням у `server/src/config/index.js` демонстраційні;
  користувач може змінити ціни для розрахунку бюджету у формі конструктора.
- Публічний демо-сервер OSRM має обмеження на навантаження. Для стабільної роботи можна
  розгорнути власний екземпляр OSRM і вказати його адресу в `OSRM_URL`.
  Якщо OSRM недоступний, система автоматично переходить на наближений розрахунок.
