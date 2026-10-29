import { Link } from 'react-router-dom';
import CategoryBadge, { toneOf } from './CategoryBadge.jsx';
import Button from './Button.jsx';
import { useTrip } from '../context/TripContext.jsx';
import { formatMinutes, formatUAH } from '../utils/format.js';

/**
 * Картка локації. Використовується на головній, у каталозі,
 * на сторінці локації («поруч») і в конструкторі (compact).
 */
export default function LocationCard({ location, compact = false, index, onRemove }) {
  const { isSelected, toggle } = useTrip();
  const selected = isSelected(location._id);
  const category = location.categoryId;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-3">
        {index !== undefined && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-route text-xs font-bold text-white">
            {index}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <Link to={`/locations/${location._id}`} className="block truncate font-semibold hover:text-fir">
            {location.name}
          </Link>
          <p className="text-xs text-slate-soft">
            {location.region} обл., огляд {formatMinutes(location.visitMin)}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(location._id)}
            className="rounded-md p-1.5 text-slate-soft hover:bg-mist hover:text-ink"
            aria-label={`Прибрати «${location.name}» з подорожі`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div className="h-1.5" style={{ background: toneOf(category).band }} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge category={category} />
          <span className="text-xs text-slate-soft">{location.region} обл.</span>
        </div>
        <h3 className="font-display text-base font-medium leading-snug">
          <Link to={`/locations/${location._id}`} className="hover:text-fir">
            {location.name}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-slate-soft">{location.description}</p>
        <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-slate-soft">На огляд</dt>
            <dd className="font-semibold">{formatMinutes(location.visitMin)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-soft">Вхід</dt>
            <dd className="font-semibold">{location.ticketPrice ? formatUAH(location.ticketPrice) : 'Безкоштовно'}</dd>
          </div>
        </dl>
        <Button
          variant={selected ? 'outline' : 'secondary'}
          size="sm"
          onClick={() => toggle(location._id)}
          aria-pressed={selected}
        >
          {selected ? 'У подорожі ✓' : 'Додати до подорожі'}
        </Button>
      </div>
    </article>
  );
}
