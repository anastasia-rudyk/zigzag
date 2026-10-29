import { formatKm, formatMinutes, formatUAH } from '../utils/format.js';

/**
 * Підсумкові показники маршруту. Показує, наскільки оптимізація
 * скоротила маршрут порівняно з жадібним алгоритмом найближчого сусіда.
 */
export default function RouteStats({ distanceKm, nnDistanceKm, durationMin, total }) {
  const saved = nnDistanceKm && nnDistanceKm > distanceKm ? nnDistanceKm - distanceKm : 0;
  const pct = saved ? (saved / nnDistanceKm) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
      <Stat label="Відстань" value={formatKm(distanceKm)} />
      <Stat label="Час у дорозі й на огляд" value={formatMinutes(durationMin)} />
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
    <div className="bg-white p-4">
      <p className="text-xs text-slate-soft">{label}</p>
      <p className={`font-display text-lg font-medium ${accent ? 'text-route-dark' : ''}`}>{value}</p>
      {hint && <p className="text-xs text-slate-soft">{hint}</p>}
    </div>
  );
}
