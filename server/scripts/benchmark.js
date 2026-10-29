/**
 * Порівняння якості та швидкості алгоритмів побудови маршруту.
 * Результати використовуються в підрозділі 3.4 «Тестування».
 * Запуск: npm run benchmark
 */
import { nearestNeighbor, twoOpt, optimizeRoute, routeLength, bruteForce } from '../src/services/routeService.js';
import { haversineMatrices } from '../src/services/geo.js';

function seededPoints(n, seed) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  // Прямокутник, що приблизно охоплює материкову Україну
  return Array.from({ length: n }, () => ({ lat: 46 + rnd() * 5, lng: 23 + rnd() * 10 }));
}

const SIZES = [5, 8, 10, 15, 20, 25];
const RUNS = 30;
const fmt = (x, d = 1) => x.toFixed(d).padStart(8);

console.log(`Кожен рядок — середнє за ${RUNS} випадковими наборами точок\n`);
console.log('   n |   NN, км | 2-opt, км | +Or-opt, км | покращ., % | від оптимуму, % |  час, мс');
console.log('-----|----------|-----------|-------------|------------|-----------------|---------');

for (const n of SIZES) {
  let sNN = 0, s2 = 0, sOr = 0, sGap = 0, sMs = 0, gapCount = 0;

  for (let seed = 1; seed <= RUNS; seed++) {
    const { distances: D } = haversineMatrices(seededPoints(n, seed * 97 + n));
    const t0 = performance.now();
    const r = optimizeRoute(D);
    sMs += performance.now() - t0;

    sNN += r.nnLength;
    s2 += routeLength(twoOpt(nearestNeighbor(D), D).route, D);
    sOr += r.length;

    if (n <= 9) {
      const exact = bruteForce(D);
      sGap += ((r.length - exact.length) / exact.length) * 100;
      gapCount++;
    }
  }

  const nn = sNN / RUNS, two = s2 / RUNS, or = sOr / RUNS;
  const gap = gapCount ? fmt(sGap / gapCount, 2) : '       —';
  console.log(
    `${String(n).padStart(4)} | ${fmt(nn)} | ${fmt(two).padStart(9)} | ${fmt(or).padStart(11)} | ${fmt(((nn - or) / nn) * 100).padStart(10)} | ${gap.padStart(15)} | ${fmt(sMs / RUNS, 2)}`
  );
}
