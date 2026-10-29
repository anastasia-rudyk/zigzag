import { config } from '../config/index.js';

const coordsParam = (points) => points.map((p) => `${p.lng},${p.lat}`).join(';');

async function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok') throw new Error(`OSRM: ${data.code}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Матриця реальних відстаней (км) і часу (хв) через OSRM Table API.
 * Повертає null, якщо сервіс недоступний — тоді використовується гаверсинус.
 */
export async function getOsrmMatrices(points, { baseUrl = config.osrmUrl, timeoutMs = config.osrmTimeoutMs } = {}) {
  const url = `${baseUrl}/table/v1/driving/${coordsParam(points)}?annotations=distance,duration`;
  try {
    const data = await fetchJson(url, timeoutMs);
    const distances = data.distances.map((row) => row.map((m) => (m ?? Infinity) / 1000));
    const durations = data.durations.map((row) => row.map((s) => (s ?? Infinity) / 60));
    const hasGaps = distances.some((row) => row.some((v) => !Number.isFinite(v)));
    if (hasGaps) return null;
    return { distances, durations };
  } catch (err) {
    console.warn(`OSRM недоступний (${err.message}), резервний розрахунок за гаверсинусом`);
    return null;
  }
}

/**
 * Геометрія маршруту дорогами для малювання на карті: [[lat, lng], ...].
 * Повертає null у разі помилки — тоді клієнт малює прямі відрізки.
 */
export async function getOsrmGeometry(orderedPoints, { baseUrl = config.osrmUrl, timeoutMs = config.osrmTimeoutMs } = {}) {
  const url = `${baseUrl}/route/v1/driving/${coordsParam(orderedPoints)}?overview=full&geometries=geojson`;
  try {
    const data = await fetchJson(url, timeoutMs);
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch {
    return null;
  }
}
