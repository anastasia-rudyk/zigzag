import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import LocationCard from '../components/LocationCard.jsx';
import MapView from '../components/MapView.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useTrip } from '../context/TripContext.jsx';

const EMPTY = { q: '', region: '', category: '', maxPrice: '', sort: 'name' };

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...EMPTY, ...Object.fromEntries(params) });
  const [debounced, setDebounced] = useState(filters);
  const [view, setView] = useState('grid');
  const { selected, toggle } = useTrip();

  // Пошук запускається через 300 мс після останньої зміни фільтра
  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters), 300);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    const clean = Object.fromEntries(Object.entries(debounced).filter(([k, v]) => v !== '' && !(k === 'sort' && v === 'name')));
    setParams(clean, { replace: true });
    // setParams змінюється після кожної навігації, тому навмисно не в залежностях
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const meta = useAsync(() => Promise.all([api.categories(), api.regions()]), []);
  const list = useAsync(() => api.locations(debounced), [JSON.stringify(debounced)]);
  const [categories, regions] = meta.data || [[], []];
  const items = useMemo(() => list.data || [], [list.data]);

  return (
    <div className="page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Каталог локацій</h1>
          <p className="text-slate-soft">
            {list.loading ? 'Шукаємо…' : `Знайдено місць: ${items.length}`}
            {selected.length > 0 && `, у вашій подорожі: ${selected.length}`}
          </p>
        </div>
        <div className="flex rounded-lg border border-line bg-white p-1" role="group" aria-label="Вигляд">
          {[['grid', 'Картки'], ['map', 'Карта']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${view === v ? 'bg-ink text-white' : 'hover:bg-mist'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            regions={regions}
            onReset={() => setFilters(EMPTY)}
          />
        </aside>

        <section aria-live="polite">
          <ErrorNote error={list.error} onRetry={list.reload} />
          {list.loading && !list.data && <Spinner />}
          {!list.loading && items.length === 0 && (
            <EmptyState title="Нічого не знайдено" text="Спробуйте змінити область, категорію або прибрати обмеження ціни." />
          )}

          {view === 'map' ? (
            <>
              <MapView locations={items} selectedIds={selected} onMarkerClick={(l) => toggle(l._id)} height={560} />
              <p className="mt-2 text-sm text-slate-soft">Натисніть на маркер, щоб додати місце до подорожі або прибрати його.</p>
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((loc) => (
                <LocationCard key={loc._id} location={loc} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
