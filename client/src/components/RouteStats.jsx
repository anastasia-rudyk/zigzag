import { formatKm, formatMinutes, formatUAH } from '../utils/format.js';

/**
 * Підсумкові показники маршруту. Показує, наскільки оптимізація
 * скоротила маршрут порівняно з жадібним алгоритмом найближчого сусіда.
 */
export default function RouteStats({ distanceKm, nnDistanceKm, durationMin, total }) {
  const saved = nnDistanceKm && nnDistanceKm > distanceKm ? nnDistanceKm - distanceKm : 0;
  const pct = saved ? (saved / nnDistanceKm) * 100 : 0;

  return (
    <div className="glass grid grid-cols-2 divide-white/10 overflow-hidden sm:grid-cols-4 sm:divide-x">
      <Stat label="Відстань" value={formatKm(distanceKm)} />
      <Stat label="У дорозі й на огляд" value={formatMinutes(durationMin)} />
      <Stat label="Бюджет" value={formatUAH(total)} />
      <Stat
        label="Економія після оптимізації"
        value={saved >= 0.05 ? formatKm(saved) : '0 км'}
        hint={saved >= 0.05 ? `на ${pct.toFixed(1)}% коротше за жадібний маршрут` : 'жадібний маршрут уже оптимальний'}
        accent
      />
    </div>
  );
}

function Stat({ label, value, hint, accent }) {
  return (
    <div className="p-4">
      <p className="text-xs text-mist">{label}</p>
      <p className={`font-display text-lg font-bold ${accent ? 'text-route-light' : ''}`}>{value}</p>
      {hint && <p className="text-xs text-mist">{hint}</p>}
    </div>
  );
}
