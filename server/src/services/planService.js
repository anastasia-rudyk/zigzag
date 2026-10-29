import { limits } from '../config/index.js';

/**
 * Жадібна розбивка маршруту по днях, формула (2.8).
 * T — матриця часу в дорозі (хв), visitMin[i] — тривалість відвідування точки i.
 * Повертає масив днів: [{ day, points: [індекси], minutes }].
 */
export function splitByDays(route, T, visitMin, maxPerDay = limits.maxMinutesPerDay) {
  const days = [{ day: 1, points: [], minutes: 0 }];

  for (let k = 0; k < route.length - 1; k++) {
    const to = route[k + 1];
    const step = T[route[k]][to] + (visitMin[to] || 0);
    const current = days.at(-1);

    if (current.minutes + step > maxPerDay && current.points.length > 0) {
      days.push({ day: days.length + 1, points: [], minutes: 0 });
    }
    days.at(-1).points.push(to);
    days.at(-1).minutes += step;
  }

  return days.map((d) => ({ ...d, minutes: Math.round(d.minutes) }));
}

/** Кошторис подорожі, формули (2.9)–(2.11). Суми в гривнях. */
export function calcBudget({ distanceKm, days, people, transport, tickets, prices }) {
  const { fuelPer100, fuelPrice, busPerKm, nightPrice, foodPerDay } = prices;

  const tr =
    transport === 'car'
      ? (distanceKm / 100) * fuelPer100 * fuelPrice
      : distanceKm * busPerKm * people;
  const lodging = Math.max(days - 1, 0) * nightPrice * Math.ceil(people / 2);
  const tick = people * tickets.reduce((sum, c) => sum + c, 0);
  const food = days * people * foodPerDay;
  const total = tr + lodging + tick + food;

  return {
    transport: Math.round(tr),
    lodging: Math.round(lodging),
    tickets: Math.round(tick),
    food: Math.round(food),
    total: Math.round(total),
  };
}
