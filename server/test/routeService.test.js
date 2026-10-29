import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nearestNeighbor, twoOpt, orOpt, routeLength, optimizeRoute, bruteForce } from '../src/services/routeService.js';
import { haversineKm, haversineMatrices, symmetrize } from '../src/services/geo.js';

// Псевдовипадкові точки з фіксованим зерном, щоб тести були відтворюваними
function seededPoints(n, seed = 42) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  return Array.from({ length: n }, () => ({ lat: 46 + rnd() * 5, lng: 23 + rnd() * 10 }));
}

const isPermutation = (route, n) =>
  route.length === n && route[0] === 0 && new Set(route).size === n && route.every((i) => i >= 0 && i < n);

test('гаверсинус: Київ — Львів близько 470 км по прямій', () => {
  const km = haversineKm({ lat: 50.4501, lng: 30.5234 }, { lat: 49.8397, lng: 24.0297 });
  assert.ok(km > 460 && km < 480, `отримано ${km}`);
});

test('гаверсинус: відстань від точки до себе дорівнює 0', () => {
  assert.equal(haversineKm({ lat: 49, lng: 24 }, { lat: 49, lng: 24 }), 0);
});

test('симетризація усереднює d_ij і d_ji', () => {
  const S = symmetrize([[0, 10], [20, 0]]);
  assert.deepEqual(S, [[0, 15], [15, 0]]);
});

test('найближчий сусід повертає коректну перестановку зі стартом 0', () => {
  const { distances } = haversineMatrices(seededPoints(12));
  assert.ok(isPermutation(nearestNeighbor(distances), 12));
});

test('найближчий сусід на прямій лінії обходить точки по порядку', () => {
  const xs = [0, 3, 1, 4, 2];
  const D = xs.map((a) => xs.map((b) => Math.abs(a - b)));
  assert.deepEqual(nearestNeighbor(D), [0, 2, 4, 1, 3]);
});

test('2-opt прибирає самоперетин маршруту', () => {
  // Квадрат 0-1-2-3, маршрут 0→2→1→3 має перехрещення
  const pts = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const D = pts.map(([x1, y1]) => pts.map(([x2, y2]) => Math.hypot(x1 - x2, y1 - y2)));
  const before = routeLength([0, 2, 1, 3], D, { closed: true });
  const { route } = twoOpt([0, 2, 1, 3], D, { closed: true });
  const after = routeLength(route, D, { closed: true });
  assert.ok(after < before);
  assert.equal(after, 4);
});

test('2-opt ніколи не погіршує маршрут і зберігає старт', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const { distances: D } = haversineMatrices(seededPoints(15, seed));
    for (const closed of [false, true]) {
      const nn = nearestNeighbor(D);
      const { route } = twoOpt(nn, D, { closed });
      assert.ok(isPermutation(route, 15));
      assert.ok(routeLength(route, D, { closed }) <= routeLength(nn, D, { closed }) + 1e-9);
    }
  }
});

test('Or-opt зберігає перестановку і не погіршує маршрут', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const { distances: D } = haversineMatrices(seededPoints(12, seed));
    for (const closed of [false, true]) {
      const base = twoOpt(nearestNeighbor(D), D, { closed }).route;
      const { route } = orOpt(base, D, { closed });
      assert.ok(isPermutation(route, 12));
      assert.ok(routeLength(route, D, { closed }) <= routeLength(base, D, { closed }) + 1e-9);
    }
  }
});

test('NN + 2-opt + Or-opt в межах 10% від точного оптимуму на малих задачах', () => {
  for (let seed = 1; seed <= 10; seed++) {
    const { distances: D } = haversineMatrices(seededPoints(8, seed));
    const exact = bruteForce(D);
    const heur = optimizeRoute(D);
    assert.ok(heur.length <= exact.length * 1.1, `seed ${seed}: ${heur.length} проти ${exact.length}`);
  }
});

test('optimizeRoute повертає відсоток покращення ≥ 0', () => {
  const { distances: D } = haversineMatrices(seededPoints(20, 7));
  const r = optimizeRoute(D);
  assert.ok(r.improvementPct >= 0);
  assert.ok(r.length <= r.nnLength);
});
