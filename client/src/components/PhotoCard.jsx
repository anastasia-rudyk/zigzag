import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';
import Icon from './Icon.jsx';
import { toneOf } from './CategoryBadge.jsx';
import { useTrip } from '../context/TripContext.jsx';

/**
 * Фото-картка локації у стилі «вітрини»: фото на всю картку, назва зверху,
 * рейтинг і кнопка «+» знизу. Використовується в каруселі головної сторінки,
 * у каталозі, на сторінці локації («Ще в цій області») і в адмін-панелі.
 */
export default function PhotoCard({ location, size = 'md', className = '', dimmed = false }) {
  const { isSelected, toggle } = useTrip();
  const selected = isSelected(location._id);
  const photo = location.photos?.[0];
  const credit = location.photoCredit;
  const height = { sm: 'h-64', md: 'h-80', lg: 'h-[26rem] sm:h-[30rem]' }[size];

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/25 shadow-glass transition-all duration-500 ${height} ${
        dimmed ? 'opacity-60' : ''
      } ${className}`}
      style={{ background: toneOf(location.categoryId).gradient }}
    >
      {photo && (
        <img
          src={photo}
          alt={location.name}
          loading="lazy"
          title={credit ? `Фото: ${credit.author}, ${credit.license}` : undefined}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {/* затемнення зверху й знизу, щоб текст читався на будь-якому фото */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/0 to-black/70" aria-hidden="true" />

      <Link to={`/locations/${location._id}`} className="absolute inset-0" aria-label={location.name} />

      <div className="pointer-events-none absolute inset-x-0 top-0 p-5">
        <h3 className="font-display text-xl font-bold leading-tight drop-shadow sm:text-2xl">{location.name}</h3>
        <p className="mt-1 text-sm text-white/85">{location.region} обл.</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div>
          <StarRating value={location.ratingAvg} showValue count={location.ratingCount} />
          <p className="mt-1 text-sm text-white/85">Детальніше »</p>
        </div>
        <button
          type="button"
          onClick={() => toggle(location._id)}
          aria-pressed={selected}
          aria-label={selected ? `Прибрати «${location.name}» з маршруту` : `Додати «${location.name}» до маршруту`}
          title={selected ? 'Прибрати з маршруту' : 'Додати до маршруту'}
          className={`pointer-events-auto relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg transition-colors ${
            selected ? 'bg-route text-white' : 'bg-white text-night hover:bg-route-light'
          }`}
        >
          <Icon name={selected ? 'check' : 'plus'} size={24} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
