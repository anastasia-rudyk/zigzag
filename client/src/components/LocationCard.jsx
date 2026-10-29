import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { toneOf } from './CategoryBadge.jsx';
import { formatMinutes } from '../utils/format.js';

/**
 * Компактний рядок локації з мініатюрою — для списку обраних місць у конструкторі
 * та в адмін-панелі. index — номер у маршруті, onRemove — кнопка «прибрати».
 */
export default function LocationCard({ location, index, onRemove }) {
  const photo = location.photos?.[0];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 pr-3">
      <div
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
        style={{ background: toneOf(location.categoryId).gradient }}
      >
        {photo && <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />}
        {index !== undefined && (
          <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-route text-xs font-bold text-white">
            {index}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link to={`/locations/${location._id}`} className="block truncate font-semibold hover:text-route-light">
          {location.name}
        </Link>
        <p className="text-xs text-mist">
          {location.region} обл., огляд {formatMinutes(location.visitMin)}
        </p>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(location._id)}
          className="rounded-full p-2 text-mist hover:bg-white/10 hover:text-ink"
          aria-label={`Прибрати «${location.name}» з маршруту`}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
