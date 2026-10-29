import { useState } from 'react';

const STAR = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z';

/**
 * Рейтинг зірками. Режим перегляду (value — дробове, напр. 4.3) або
 * вибору оцінки (onChange). Використовується на картках, сторінці локації,
 * у формі відгуку та списку відгуків.
 */
export default function StarRating({ value = 0, onChange, size = 16, showValue = false, count }) {
  const [hover, setHover] = useState(0);
  const interactive = Boolean(onChange);
  const shown = hover || value;

  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fill = Math.max(0, Math.min(1, shown - (i - 1))); // часткове заповнення для 4.3
    const id = `star-${i}-${Math.round(fill * 100)}`;
    const svg = (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={id}>
            <stop offset={`${fill * 100}%`} stopColor="#F5C451" />
            <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>
        </defs>
        <path d={STAR} fill={`url(#${id})`} />
      </svg>
    );
    if (!interactive) return <span key={i}>{svg}</span>;
    return (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i)}
        onMouseEnter={() => setHover(i)}
        onMouseLeave={() => setHover(0)}
        className="rounded p-0.5 transition-transform hover:scale-110"
        aria-label={`Оцінка ${i} з 5`}
        aria-pressed={value === i}
      >
        {svg}
      </button>
    );
  });

  return (
    <span
      className="inline-flex items-center gap-1"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Оберіть оцінку' : value ? `Рейтинг ${value} з 5` : 'Ще немає оцінок'}
    >
      <span className="inline-flex">{stars}</span>
      {showValue && (
        <span className="ml-1 text-sm font-bold">
          {value ? `${value.toFixed(1)}/5` : 'Нове місце'}
          {count > 0 && <span className="font-normal text-mist"> ({count})</span>}
        </span>
      )}
    </span>
  );
}
