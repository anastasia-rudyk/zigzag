import { geo } from '../config/index.js';

const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Відстань по дузі великого кола між двома точками, км.
 * Формули (2.3)–(2.4) пояснювальної записки.
 */
export function haversineKm(p1, p2, R = geo.earthRadiusKm) {
  const dPhi = toRad(p2.lat - p1.lat);
  const dLambda = toRad(p2.lng - p1.lng);
  const h =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLambda / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Резервні матриці відстаней (км) і часу (хв) з урахуванням
 * коефіцієнта звивистості доріг, формула (2.5).
 */
export function haversineMatrices(points, transport = 'car') {
  const n = points.length;
  const speed = geo.speedKmh[transport] || geo.speedKmh.car;
  const distances = Array.from({ length: n }, () => new Array(n).fill(0));
  const durations = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const road = haversineKm(points[i], points[j]) * geo.roadFactor;
      const minutes = (road / speed) * 60;
      distances[i][j] = distances[j][i] = road;
      durations[i][j] = durations[j][i] = minutes;
    }
  }
  return { distances, durations };
}

/** Симетризація матриці: d_ij = d_ji = (d_ij + d_ji) / 2 */
export function symmetrize(M) {
  const n = M.length;
  const S = M.map((row) => [...row]);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const avg = (M[i][j] + M[j][i]) / 2;
      S[i][j] = S[j][i] = avg;
    }
  }
  return S;
}
