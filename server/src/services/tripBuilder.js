import { defaultPrices, limits } from '../config/index.js';
import { haversineMatrices, symmetrize } from './geo.js';
import { getOsrmMatrices, getOsrmGeometry } from './osrm.js';
import { optimizeRoute } from './routeService.js';
import { splitByDays, calcBudget } from './planService.js';

const round1 = (x) => Math.round(x * 10) / 10;

/** Перевірка вхідних даних. Повертає масив повідомлень про помилки. */
export function validateBuildInput(body) {
  const errors = [];
  const { start, locationIds, days, people = 1, transport = 'car' } = body || {};

  if (!start || typeof start.lat !== 'number' || typeof start.lng !== 'number') {
    errors.push('Оберіть стартову точку');
  }
  if (!Array.isArray(locationIds) || locationIds.length < 1) {
    errors.push('Оберіть щонайменше одну локацію');
  } else if (locationIds.length + 1 > limits.maxPoints) {
    errors.push(`Максимум ${limits.maxPoints - 1} локацій у маршруті`);
  } else if (new Set(locationIds).size !== locationIds.length) {
    errors.push('Локації не повинні повторюватися');
  }
  if (!Number.isInteger(days) || days < limits.minDays || days > limits.maxDays) {
    errors.push(`Кількість днів — від ${limits.minDays} до ${limits.maxDays}`);
  }
  if (!Number.isInteger(people) || people < 1 || people > limits.maxPeople) {
    errors.push(`Кількість подорожніх — від 1 до ${limits.maxPeople}`);
  }
  if (!['car', 'bus'].includes(transport)) {
    errors.push('Невідомий спосіб пересування');
  }
  return errors;
}

/**
 * Будує план подорожі.
 * locations — документи Location у тому порядку, в якому їх обрав користувач.
 * deps дозволяє підмінити зовнішні сервіси в тестах.
 */
export async function buildTrip(input, locations, deps = {}) {
  const {
    start,
    days,
    people = 1,
    transport = 'car',
    roundTrip = false,
    prices: customPrices = {},
  } = input;
  const getMatrices = deps.getMatrices || getOsrmMatrices;
  const getGeometry = deps.getGeometry || getOsrmGeometry;

  const points = [
    { name: start.name || 'Старт', lat: start.lat, lng: start.lng },
    ...locations.map((l) => ({ name: l.name, lat: l.lat, lng: l.lng })),
  ];

  // 1. Матриці відстаней і часу: OSRM або резервний гаверсинус
  let source = 'osrm';
  let matrices = await getMatrices(points);
  if (!matrices) {
    source = 'haversine';
    matrices = haversineMatrices(points, transport);
  }
  const D = symmetrize(matrices.distances);
  const T = symmetrize(matrices.durations);

  // 2. Оптимізація: найближчий сусід + 2-opt
  const opt = optimizeRoute(D, { closed: roundTrip });
  const order = roundTrip ? [...opt.route, 0] : opt.route;

  // 3. Розбивка по днях
  const visitMin = [0, ...locations.map((l) => l.visitMin || 0)];
  const plan = splitByDays(order, T, visitMin);
  const durationMin = plan.reduce((s, d) => s + d.minutes, 0);

  // 4. Бюджет
  const prices = { ...defaultPrices, ...sanitizePrices(customPrices) };
  const budget = calcBudget({
    distanceKm: opt.length,
    days,
    people,
    transport,
    tickets: locations.map((l) => l.ticketPrice || 0),
    prices,
  });

  // 5. Геометрія дорогами для карти (необов'язково)
  const orderedPoints = order.map((i) => points[i]);
  const geometry = source === 'osrm' ? await getGeometry(orderedPoints) : null;

  const warnings = [];
  if (plan.length > days) {
    warnings.push(
      `Маршрут не вміщується в ${days} дн.: потрібно ${plan.length}. Додайте дні або приберіть частину локацій.`
    );
  }
  if (source === 'haversine') {
    warnings.push('Сервіс маршрутизації недоступний: відстані розраховано наближено за гаверсинусом.');
  }

  // Індекс 0 — старт, індекс i ≥ 1 — locations[i - 1]
  const toLocationId = (i) => (i === 0 ? null : String(locations[i - 1]._id));

  // Відстань кожного переходу маршруту — для стрічки маршруту в інтерфейсі
  const legsKm = order.slice(0, -1).map((from, k) => round1(D[from][order[k + 1]]));

  return {
    source,
    order: opt.route.slice(1).map(toLocationId),
    legsKm,
    twoOptDistanceKm: round1(opt.twoOptLength),
    distanceKm: round1(opt.length),
    nnDistanceKm: round1(opt.nnLength),
    improvementPct: round1(opt.improvementPct),
    passes: opt.passes,
    durationMin: Math.round(durationMin),
    plan: plan.map((d) => ({
      day: d.day,
      minutes: d.minutes,
      points: d.points.filter((i) => i !== 0).map(toLocationId),
      returnsToStart: d.points.includes(0),
    })),
    budget,
    prices,
    geometry,
    warnings,
  };
}

function sanitizePrices(p) {
  const out = {};
  for (const key of Object.keys(defaultPrices)) {
    const v = Number(p?.[key]);
    if (Number.isFinite(v) && v >= 0) out[key] = v;
  }
  return out;
}
