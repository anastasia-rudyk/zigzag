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
          <li key={`${stop.name}-${i}`} className="relative pb-1 pl-10">
            {i < items.length - 1 && (
              <span className="absolute left-[13px] top-7 h-full w-0.5 bg-route" aria-hidden="true" />
            )}
            <span
              className={`absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                isEdge ? 'border-white bg-white text-night' : 'border-route bg-night text-route-light'
              }`}
              aria-hidden="true"
            >
              {i === 0 || (roundTrip && i === items.length - 1) ? 'S' : i}
            </span>
            <p className="font-semibold leading-tight">{stop.name}</p>
            {stop.note && <p className="text-xs text-mist">{stop.note}</p>}
            {i < items.length - 1 && (
              <p className="py-2 text-xs font-bold text-route-light">{leg !== undefined ? formatKm(leg) : ''}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
