import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitByDays, calcBudget } from '../src/services/planService.js';
import { buildTrip, validateBuildInput } from '../src/services/tripBuilder.js';
import { defaultPrices } from '../src/config/index.js';

test('розбивка по днях не перевищує денний ліміт', () => {
  // 4 точки, переїзд 100 хв, відвідування 120 хв → 220 хв на точку
  const T = Array.from({ length: 5 }, () => new Array(5).fill(100));
  const visit = [0, 120, 120, 120, 120];
  const days = splitByDays([0, 1, 2, 3, 4], T, visit, 480);
  assert.equal(days.length, 2);
  assert.deepEqual(days.map((d) => d.points), [[1, 2], [3, 4]]);
  assert.ok(days.every((d) => d.minutes <= 480));
});

test('точка, довша за ліміт, усе одно потрапляє в окремий день', () => {
  const T = [[0, 10], [10, 0]];
  const days = splitByDays([0, 1], T, [0, 600], 480);
  assert.equal(days.length, 1);
  assert.deepEqual(days[0].points, [1]);
});

test('бюджет для авто рахується за формулами (2.9)–(2.11)', () => {
  const b = calcBudget({
    distanceKm: 500,
    days: 3,
    people: 3,
    transport: 'car',
    tickets: [100, 150],
    prices: { fuelPer100: 8, fuelPrice: 50, busPerKm: 1, nightPrice: 1000, foodPerDay: 500 },
  });
  assert.equal(b.transport, 2000); // 500/100 · 8 · 50
  assert.equal(b.lodging, 4000); // 2 ночі · 1000 · 2 номери
  assert.equal(b.tickets, 750); // 3 · (100 + 150)
  assert.equal(b.food, 4500); // 3 · 3 · 500
  assert.equal(b.total, 11250);
});

test('для автобуса транспорт рахується на кожного подорожнього', () => {
  const b = calcBudget({
    distanceKm: 100, days: 1, people: 2, transport: 'bus', tickets: [],
    prices: { fuelPer100: 8, fuelPrice: 50, busPerKm: 2, nightPrice: 1000, foodPerDay: 0 },
  });
  assert.equal(b.transport, 400);
  assert.equal(b.lodging, 0);
});

test('валідація відхиляє порожній маршрут і завелику кількість днів', () => {
  const errors = validateBuildInput({ start: { lat: 50, lng: 30 }, locationIds: [], days: 30 });
  assert.equal(errors.length, 2);
});

test('buildTrip працює з резервним гаверсинусом, коли OSRM недоступний', async () => {
  const locations = [
    { _id: 'a', name: 'Олеський замок', lat: 49.964, lng: 24.903, visitMin: 90, ticketPrice: 100 },
    { _id: 'b', name: 'Золочівський замок', lat: 49.8076, lng: 24.9028, visitMin: 60, ticketPrice: 100 },
    { _id: 'c', name: 'Підгорецький замок', lat: 49.9439, lng: 24.9842, visitMin: 60, ticketPrice: 100 },
  ];
  const r = await buildTrip(
    { start: { name: 'Львів', lat: 49.8397, lng: 24.0297 }, locationIds: ['a', 'b', 'c'], days: 1, people: 2 },
    locations,
    { getMatrices: async () => null, getGeometry: async () => null }
  );
  assert.equal(r.source, 'haversine');
  assert.equal(r.order.length, 3);
  assert.deepEqual([...r.order].sort(), ['a', 'b', 'c']);
  assert.ok(r.distanceKm > 0 && r.distanceKm <= r.nnDistanceKm);
  assert.equal(r.budget.tickets, 600);
  assert.equal(r.prices.fuelPrice, defaultPrices.fuelPrice);
  assert.ok(r.warnings.some((w) => w.includes('гаверсинус')));
});
