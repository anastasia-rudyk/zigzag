import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { toneOf } from '../components/CategoryBadge.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useBackdrop } from '../context/BackdropContext.jsx';
import { formatKm, formatUAH, pluralDays, transportLabel } from '../utils/format.js';

export default function TripsPage() {
  const { data, loading, error, reload, setData } = useAsync(() => api.trips(), []);
  useBackdrop(data?.flatMap((t) => t.points).find((p) => p?.photos?.length)?.photos[0]);

  async function remove(trip) {
    if (!window.confirm(`Видалити подорож «${trip.title}»?`)) return;
    await api.deleteTrip(trip._id);
    setData(data.filter((t) => t._id !== trip._id));
  }

  return (
    <div className="page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold sm:text-5xl">Мої подорожі</h1>
        <Button to="/planner" variant="light">Нова подорож</Button>
      </div>

      {loading && <Spinner />}
      <ErrorNote error={error} onRetry={reload} />
      {data?.length === 0 && (
        <EmptyState title="Ще немає збережених подорожей" text="Оберіть місця, побудуйте маршрут у конструкторі та збережіть його." action="Обрати місця" to="/catalog" />
      )}

      <ul className="grid gap-5 md:grid-cols-2">
        {data?.map((t) => {
          const points = t.points.filter(Boolean);
          return (
            <li key={t._id} className="glass flex flex-col overflow-hidden">
              <div className="flex h-28">
                {points.slice(0, 4).map((p) => (
                  <div key={p._id} className="flex-1 border-r border-night/40 last:border-0" style={{ background: toneOf(p.categoryId).gradient }}>
                    {p.photos?.[0] && <img src={p.photos[0]} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h2 className="text-lg font-bold">
                    <Link to={`/trips/${t._id}`} className="hover:text-route-light">{t.title}</Link>
                  </h2>
                  <p className="text-sm text-mist">
                    Старт: {t.start.name}, {pluralDays(t.days)}, {transportLabel[t.transport].toLowerCase()}
                  </p>
                </div>
                <p className="text-sm">{points.map((p) => p.name).join(', ')}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <span className="text-sm font-bold">
                    {formatKm(t.distanceKm)}, {formatUAH(t.budget?.total)}
                  </span>
                  <div className="flex gap-2">
                    <Button to={`/trips/${t._id}`} variant="glass" size="sm">Відкрити</Button>
                    <Button variant="danger" size="sm" onClick={() => remove(t)}>Видалити</Button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
