import { formatKm } from '../utils/format.js';

/**
 * Стрічка маршруту: зупинки по порядку та відстань між ними.
 * Використовується на головній (приклад), у конструкторі та в збереженій подорожі.
 *
 * stops — [{ name, note }], legs — відстані між сусідніми зупинками, км
 */
export default function RouteRibbon({ stops, legs = [], roundTrip = false }) {
  const items = roundTrip ? [...stops, { ...stops[0], note: 'повернення' }] : stops;

  return (
    <ol className="relative">
      {items.map((stop, i) => {
        const isEdge = i === 0 || i === items.length - 1;
        const leg = legs[i];
        return (
          <li key={`${stop.name}-${i}`} className="relative pb-1 pl-9">
            {i < items.length - 1 && (
              <span className="absolute left-[11px] top-6 h-full w-0.5 bg-route" aria-hidden="true" />
            )}
            <span
              className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                isEdge ? 'border-ink bg-ink text-white' : 'border-route bg-white text-route-dark'
              }`}
              aria-hidden="true"
            >
              {i === 0 ? 'S' : roundTrip && i === items.length - 1 ? 'S' : i}
            </span>
            <p className="font-semibold leading-tight">{stop.name}</p>
            {stop.note && <p className="text-xs text-slate-soft">{stop.note}</p>}
            {i < items.length - 1 && (
              <p className="py-2 text-xs font-semibold text-route-dark">{leg !== undefined ? formatKm(leg) : ''}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
