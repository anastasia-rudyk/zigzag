/**
 * Алгоритми побудови маршруту (підрозділ 2.2 пояснювальної записки).
 * D — квадратна матриця відстаней, індекс 0 — стартова точка.
 */

const EPS = 1e-9;

/** Алгоритм найближчого сусіда, формула (2.6). Складність O(n²). */
export function nearestNeighbor(D) {
  const n = D.length;
  const visited = new Array(n).fill(false);
  const route = [0];
  visited[0] = true;
  let cur = 0;

  for (let step = 1; step < n; step++) {
    let next = -1;
    let best = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && D[cur][j] < best) {
        best = D[cur][j];
        next = j;
      }
    }
    route.push(next);
    visited[next] = true;
    cur = next;
  }
  return route;
}

/**
 * Локальний пошук 2-opt, формула (2.7). Один прохід — O(n²).
 * closed = true — замкнений маршрут із поверненням у старт.
 * Стартова точка (позиція 0) ніколи не переміщується.
 */
export function twoOpt(route, D, { closed = false } = {}) {
  const r = closed ? [...route, route[0]] : [...route];
  const n = r.length;
  const lastJ = closed ? n - 2 : n - 1; // у замкненому маршруті фінальний старт фіксований
  const d = (x, y) => (x === undefined || y === undefined ? 0 : D[x][y]);
  let improved = true;
  let passes = 0;

  while (improved) {
    improved = false;
    passes++;
    for (let i = 1; i < lastJ; i++) {
      for (let j = i + 1; j <= lastJ; j++) {
        const a = r[i - 1];
        const b = r[i];
        const c = r[j];
        const e = r[j + 1];
        const delta = d(a, c) + d(b, e) - d(a, b) - d(c, e);
        if (delta < -EPS) {
          // розвертаємо ділянку r[i..j]
          for (let lo = i, hi = j; lo < hi; lo++, hi--) {
            [r[lo], r[hi]] = [r[hi], r[lo]];
          }
          improved = true;
        }
      }
    }
  }

  return { route: closed ? r.slice(0, -1) : r, passes };
}

/**
 * Or-opt: переносить ділянку з 1–3 сусідніх точок в інше місце маршруту
 * (у прямому або зворотному порядку), якщо це скорочує маршрут.
 * Доповнює 2-opt: знаходить покращення, недосяжні розворотом ділянок.
 */
export function orOpt(route, D, { closed = false, maxSegment = 3 } = {}) {
  let r = closed ? [...route, route[0]] : [...route];
  const d = (x, y) => (x === undefined || y === undefined ? 0 : D[x][y]);
  let improved = true;
  let moves = 0;

  while (improved) {
    improved = false;
    const n = r.length;
    const lastMovable = closed ? n - 2 : n - 1; // фінальний старт у замкненому маршруті не рухаємо

    search: for (let L = 1; L <= maxSegment; L++) {
      for (let i = 1; i + L - 1 <= lastMovable; i++) {
        const s0 = r[i];
        const sL = r[i + L - 1];
        const prev = r[i - 1];
        const next = r[i + L];
        const removeGain = d(prev, s0) + d(sL, next) - d(prev, next);

        const rest = [...r.slice(0, i), ...r.slice(i + L)];
        const segment = r.slice(i, i + L);
        const maxP = closed ? rest.length - 2 : rest.length - 1;

        for (let p = 0; p <= maxP; p++) {
          if (p === i - 1) continue; // та сама позиція
          const a = rest[p];
          const b = rest[p + 1];
          const forward = d(a, s0) + d(sL, b) - d(a, b);
          const backward = d(a, sL) + d(s0, b) - d(a, b);
          const reversed = backward < forward;
          if (Math.min(forward, backward) - removeGain < -EPS) {
            const seg = reversed ? [...segment].reverse() : segment;
            r = [...rest.slice(0, p + 1), ...seg, ...rest.slice(p + 1)];
            improved = true;
            moves++;
            break search;
          }
        }
      }
    }
  }

  return { route: closed ? r.slice(0, -1) : r, moves };
}

/** Довжина маршруту, формула (2.1). */
export function routeLength(route, D, { closed = false } = {}) {
  let sum = 0;
  for (let k = 0; k < route.length - 1; k++) {
    sum += D[route[k]][route[k + 1]];
  }
  if (closed && route.length > 1) sum += D[route[route.length - 1]][route[0]];
  return sum;
}

/**
 * Повний цикл оптимізації: NN → (2-opt → Or-opt) доти, доки маршрут скорочується.
 * Повертає метрики для порівняння якості на кожному етапі.
 */
export function optimizeRoute(D, { closed = false } = {}) {
  const nnRoute = nearestNeighbor(D);
  const nnLength = routeLength(nnRoute, D, { closed });

  let route = nnRoute;
  let length = nnLength;
  let twoOptLength = null;
  let passes = 0;
  let orMoves = 0;

  for (let round = 0; round < 50; round++) {
    const t = twoOpt(route, D, { closed });
    passes += t.passes;
    if (twoOptLength === null) twoOptLength = routeLength(t.route, D, { closed });
    const o = orOpt(t.route, D, { closed });
    orMoves += o.moves;
    const newLength = routeLength(o.route, D, { closed });
    route = o.route;
    if (newLength >= length - EPS) {
      length = newLength;
      break;
    }
    length = newLength;
  }

  const improvementPct = nnLength > 0 ? ((nnLength - length) / nnLength) * 100 : 0;
  return { nnRoute, nnLength, twoOptLength, route, length, passes, orMoves, improvementPct };
}

/**
 * Точний розв'язок повним перебором — лише для тестування якості
 * евристик на малих n (n ≤ 9). Складність O(n!).
 */
export function bruteForce(D, { closed = false } = {}) {
  const n = D.length;
  const rest = Array.from({ length: n - 1 }, (_, i) => i + 1);
  let best = { route: null, length: Infinity };

  const permute = (arr, k) => {
    if (k === arr.length) {
      const route = [0, ...arr];
      const len = routeLength(route, D, { closed });
      if (len < best.length) best = { route, length: len };
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };

  permute(rest, 0);
  return best;
}
