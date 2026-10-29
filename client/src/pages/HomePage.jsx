import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs.jsx';
import PhotoCard from '../components/PhotoCard.jsx';
import RouteRibbon from '../components/RouteRibbon.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useBackdrop } from '../context/BackdropContext.jsx';

const SAMPLE_STOPS = [
  { name: 'Львів', note: 'старт' },
  { name: 'Олеський замок', note: 'огляд 1 год 30 хв' },
  { name: 'Підгорецький замок', note: 'огляд 1 год' },
  { name: 'Золочівський замок', note: 'огляд 1 год' },
];

const STEPS = [
  ['Оберіть місця', 'Натискайте «+» на картках або маркерах карти — місця потраплять у ваш маршрут.'],
  ['Задайте параметри', 'Місто старту, кількість днів, подорожніх і транспорт.'],
  ['Отримайте маршрут', 'Zigzag знайде найкоротший порядок відвідування, розкладе його по днях і порахує бюджет.'],
];

export default function HomePage() {
  const all = useAsync(() => Promise.all([api.locations({ sort: 'rating' }), api.categories()]), []);
  const [locations, categories] = all.data || [[], []];
  const [category, setCategory] = useState('');
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  // Для каруселі — локації з фото, щоб вітрина виглядала цілісно
  const items = useMemo(() => {
    const withPhoto = locations.filter((l) => l.photos?.length);
    const pool = withPhoto.length >= 6 ? withPhoto : locations;
    return pool.filter((l) => !category || l.categoryId?._id === category).slice(0, 12);
  }, [locations, category]);

  useBackdrop(items[active]?.photos?.[0]);

  // Нова категорія — карусель повертається до першої картки
  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [category]);

  // Активна картка — та, чий центр найближчий до центру каруселі
  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    [...track.children].forEach((el, i) => {
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== active) setActive(best);
  }

  function goTo(i) {
    const el = trackRef.current?.children[i];
    if (!el) return;
    const track = trackRef.current;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }

  return (
    <div className="space-y-16">
      <section aria-labelledby="hero-title">
        <div className="page flex flex-col items-center text-center">
          <h1 id="hero-title" className="mb-6 mt-4 text-4xl font-bold sm:text-6xl">
            Куди поїдемо?
          </h1>
          <CategoryTabs categories={categories} value={category} onChange={setCategory} className="mb-8" />
        </div>

        {all.loading && <div className="page"><Spinner /></div>}
        <div className="page"><ErrorNote error={all.error} onRetry={all.reload} /></div>

        {items.length > 0 && (
          <div className="relative">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="no-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto scroll-smooth py-6"
              style={{ paddingInline: 'max(1rem, calc(50% - 11rem))' }}
              aria-label="Популярні місця"
            >
              {items.map((loc, i) => (
                <div
                  key={loc._id}
                  className={`w-[78vw] max-w-[22rem] shrink-0 snap-center transition-transform duration-500 ${
                    i === active ? 'scale-100' : 'scale-[0.88]'
                  }`}
                >
                  <PhotoCard location={loc} size="lg" dimmed={i !== active} />
                </div>
              ))}
            </div>

            {/* На телефоні стрілки під каруселлю, на ширших екранах — по боках */}
            <div className="page no-print mt-2 flex items-center justify-center gap-3 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-between">
              <button
                onClick={() => goTo(Math.max(active - 1, 0))}
                disabled={active === 0}
                className="glass flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40 sm:pointer-events-auto sm:h-14 sm:w-14"
                aria-label="Попереднє місце"
              >
                <Icon name="chevronLeft" />
              </button>
              <span className="min-w-16 text-center text-sm text-mist sm:hidden" aria-live="polite">
                {active + 1} / {items.length}
              </span>
              <button
                onClick={() => goTo(Math.min(active + 1, items.length - 1))}
                disabled={active === items.length - 1}
                className="glass flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40 sm:pointer-events-auto sm:h-14 sm:w-14"
                aria-label="Наступне місце"
              >
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="page grid gap-6 lg:grid-cols-[1.3fr_1fr]" aria-labelledby="how">
        <div className="glass p-6 sm:p-8">
          <h2 id="how" className="mb-6 text-2xl font-bold">
            Подорожі без зайвих зигзагів
          </h2>
          <ol className="space-y-5">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-route font-display font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="mb-0.5 font-sans text-base font-bold">{title}</h3>
                  <p className="text-sm text-mist">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/catalog" variant="light" size="lg">
              Обрати місця
            </Button>
            <Button to="/planner" variant="glass" size="lg">
              Відкрити конструктор
            </Button>
          </div>
        </div>

        <aside className="glass p-6" aria-label="Приклад маршруту">
          <div className="mb-5 flex items-baseline justify-between gap-2">
            <h2 className="text-base font-bold">Золота підкова Львівщини</h2>
            <span className="text-sm text-mist">1 день</span>
          </div>
          <RouteRibbon stops={SAMPLE_STOPS} legs={[72, 9, 24]} />
          <p className="mt-4 border-t border-white/10 pt-4 text-sm text-mist">
            Приклад маршруту, відстані наближені.
          </p>
        </aside>
      </section>
    </div>
  );
}
