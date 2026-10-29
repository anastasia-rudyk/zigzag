import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { formatKm, formatUAH, pluralDays, transportLabel } from '../utils/format.js';

export default function TripsPage() {
  const { data, loading, error, reload, setData } = useAsync(() => api.trips(), []);

  async function remove(trip) {
    if (!window.confirm(`Видалити подорож «${trip.title}»?`)) return;
    await api.deleteTrip(trip._id);
    setData(data.filter((t) => t._id !== trip._id));
  }

  return (
    <div className="page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">Мої подорожі</h1>
        <Button to="/planner">Нова подорож</Button>
      </div>

      {loading && <Spinner />}
      <ErrorNote error={error} onRetry={reload} />
      {data?.length === 0 && (
        <EmptyState title="Ще немає збережених подорожей" text="Оберіть місця, побудуйте маршрут у конструкторі та збережіть його." action="Обрати місця" to="/catalog" />
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {data?.map((t) => (
          <li key={t._id} className="panel flex flex-col gap-3 p-5">
            <div>
              <h2 className="text-lg font-medium">
                <Link to={`/trips/${t._id}`} className="hover:text-fir">{t.title}</Link>
              </h2>
              <p className="text-sm text-slate-soft">
                Старт: {t.start.name}, {pluralDays(t.days)}, {transportLabel[t.transport].toLowerCase()}
              </p>
            </div>
            <p className="text-sm">{t.points.map((p) => p.name).join(', ')}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-sm font-semibold">
                {formatKm(t.distanceKm)}, {formatUAH(t.budget?.total)}
              </span>
              <div className="flex gap-2">
                <Button to={`/trips/${t._id}`} variant="outline" size="sm">Відкрити</Button>
                <Button variant="danger" size="sm" onClick={() => remove(t)}>Видалити</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
