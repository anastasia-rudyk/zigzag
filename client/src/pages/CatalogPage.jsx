import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import CategoryTabs from '../components/CategoryTabs.jsx';
import PhotoCard from '../components/PhotoCard.jsx';
import MapView from '../components/MapView.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useTrip } from '../context/TripContext.jsx';
import { useBackdrop } from '../context/BackdropContext.jsx';

const EMPTY = { q: '', region: '', category: '', maxPrice: '', sort: 'rating' };

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
    const clean = Object.fromEntries(
      Object.entries(debounced).filter(([k, v]) => v !== '' && !(k === 'sort' && v === EMPTY.sort))
    );
    setParams(clean, { replace: true });
    // setParams змінюється після кожної навігації, тому навмисно не в залежностях
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const meta = useAsync(() => Promise.all([api.categories(), api.regions()]), []);
  const list = useAsync(() => api.locations(debounced), [JSON.stringify(debounced)]);
  const [categories, regions] = meta.data || [[], []];
  const items = useMemo(() => list.data || [], [list.data]);

  useBackdrop(items.find((l) => l.photos?.length)?.photos[0]);

  return (
    <div className="page space-y-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-3xl font-bold sm:text-5xl">Каталог місць</h1>
        <CategoryTabs categories={categories} value={filters.category} onChange={(category) => setFilters((f) => ({ ...f, category }))} />
      </div>

      <FilterBar filters={filters} onChange={setFilters} regions={regions} onReset={() => setFilters(EMPTY)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-mist" aria-live="polite">
          {list.loading ? 'Шукаємо…' : `Знайдено місць: ${items.length}`}
          {selected.length > 0 && `, у маршруті: ${selected.length}`}
        </p>
        <div className="glass flex rounded-full p-1" role="group" aria-label="Вигляд">
          {[['grid', 'Картки'], ['map', 'Карта']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${view === v ? 'bg-white text-night' : 'hover:bg-white/10'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ErrorNote error={list.error} onRetry={list.reload} />
      {list.loading && !list.data && <Spinner />}
      {!list.loading && items.length === 0 && (
        <EmptyState title="Нічого не знайдено" text="Спробуйте іншу категорію чи область або приберіть обмеження ціни." />
      )}

      {view === 'map' ? (
        <div>
          <MapView locations={items} selectedIds={selected} onMarkerClick={(l) => toggle(l._id)} height={600} />
          <p className="mt-2 text-sm text-mist">Натисніть на маркер, щоб додати місце до маршруту або прибрати його.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((loc) => (
            <PhotoCard key={loc._id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
