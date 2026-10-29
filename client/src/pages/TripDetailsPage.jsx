import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import MapView from '../components/MapView.jsx';
import RouteRibbon from '../components/RouteRibbon.jsx';
import RouteStats from '../components/RouteStats.jsx';
import DayPlan from '../components/DayPlan.jsx';
import BudgetTable from '../components/BudgetTable.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useBackdrop } from '../context/BackdropContext.jsx';
import { formatMinutes, pluralDays, transportLabel } from '../utils/format.js';

export default function TripDetailsPage() {
  const { id } = useParams();
  const { data: trip, loading, error, reload } = useAsync(() => api.trip(id), [id]);
  const points = (trip?.points || []).filter(Boolean); // локація могла бути видалена адміністратором
  useBackdrop(points.find((p) => p.photos?.length)?.photos[0]);

  if (loading) return <div className="page"><Spinner /></div>;
  if (error) return <div className="page"><ErrorNote error={error} onRetry={reload} /></div>;

  const byId = Object.fromEntries(points.map((p) => [p._id, p]));
  const plan = trip.plan.map((d) => ({ ...d, points: d.points.filter(Boolean).map((p) => p._id) }));
  const line =
    trip.geometry?.length > 1
      ? trip.geometry
      : [
          [trip.start.lat, trip.start.lng],
          ...points.map((p) => [p.lat, p.lng]),
          ...(trip.roundTrip ? [[trip.start.lat, trip.start.lng]] : []),
        ];

  return (
    <div className="page space-y-6">
      <nav className="no-print text-sm text-mist" aria-label="Хлібні крихти">
        <Link to="/trips" className="hover:text-ink">Мої подорожі</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{trip.title}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{trip.title}</h1>
          <p className="mt-1 text-mist">
            Старт: {trip.start.name}, {pluralDays(trip.days)}, подорожніх: {trip.people}, {transportLabel[trip.transport].toLowerCase()}
          </p>
        </div>
        <Button variant="light" className="no-print" onClick={() => window.print()}>
          Експортувати в PDF
        </Button>
      </div>

      <RouteStats distanceKm={trip.distanceKm} nnDistanceKm={trip.nnDistanceKm} durationMin={trip.durationMin} total={trip.budget?.total} />

      <MapView locations={points} selectedIds={points.map((p) => p._id)} order={points.map((p) => p._id)} start={trip.start} line={line} height={440} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-5">
          <h2 className="mb-4 text-base font-bold">Маршрут</h2>
          <RouteRibbon
            stops={[{ name: trip.start.name, note: 'старт' }, ...points.map((p) => ({ name: p.name, note: `огляд ${formatMinutes(p.visitMin)}` }))]}
            legs={trip.legsKm}
            roundTrip={trip.roundTrip}
          />
        </div>
        <div className="space-y-6">
          <div className="glass p-5">
            <h2 className="mb-3 text-base font-bold">План по днях</h2>
            <DayPlan plan={plan} byId={byId} days={trip.days} />
          </div>
          <div className="glass p-5">
            <h2 className="mb-3 text-base font-bold">Кошторис</h2>
            <BudgetTable budget={trip.budget} />
          </div>
        </div>
      </div>
    </div>
  );
}
