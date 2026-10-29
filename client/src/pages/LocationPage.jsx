import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import LocationCard from '../components/LocationCard.jsx';
import MapView from '../components/MapView.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useTrip } from '../context/TripContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatMinutes, formatUAH } from '../utils/format.js';

export default function LocationPage() {
  const { id } = useParams();
  const { isSelected, toggle } = useTrip();
  const { user, toggleFavorite } = useAuth();

  const { data: loc, loading, error, reload } = useAsync(() => api.location(id), [id]);
  const nearby = useAsync(
    () => (loc ? api.locations({ region: loc.region }) : Promise.resolve([])),
    [loc?._id]
  );

  if (loading) return <div className="page"><Spinner /></div>;
  if (error) return <div className="page"><ErrorNote error={error} onRetry={reload} /></div>;

  const selected = isSelected(loc._id);
  const favorite = user?.favorites?.some((f) => String(f) === loc._id);
  const others = (nearby.data || []).filter((l) => l._id !== loc._id).slice(0, 3);

  return (
    <div className="page space-y-10">
      <nav className="text-sm text-slate-soft" aria-label="Хлібні крихти">
        <Link to="/catalog" className="hover:text-fir">Каталог</Link>
        <span aria-hidden="true"> / </span>
        <span>{loc.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <CategoryBadge category={loc.categoryId} />
          <h1 className="mb-2 mt-3 text-3xl font-bold sm:text-4xl">{loc.name}</h1>
          <p className="mb-6 text-slate-soft">{loc.region} область</p>
          <p className="mb-6 max-w-prose text-lg">{loc.description}</p>

          <dl className="mb-6 grid max-w-sm grid-cols-2 gap-4">
            <div className="panel p-4">
              <dt className="text-xs text-slate-soft">Час на огляд</dt>
              <dd className="font-display text-lg">{formatMinutes(loc.visitMin)}</dd>
            </div>
            <div className="panel p-4">
              <dt className="text-xs text-slate-soft">Вхідний квиток</dt>
              <dd className="font-display text-lg">{loc.ticketPrice ? formatUAH(loc.ticketPrice) : 'Безкоштовно'}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Button variant={selected ? 'outline' : 'primary'} onClick={() => toggle(loc._id)} aria-pressed={selected}>
              {selected ? 'Прибрати з подорожі' : 'Додати до подорожі'}
            </Button>
            {selected && <Button to="/planner" variant="secondary">Перейти до конструктора</Button>}
            {user && (
              <Button variant="ghost" onClick={() => toggleFavorite(loc._id)} aria-pressed={favorite}>
                {favorite ? '★ В обраному' : '☆ В обране'}
              </Button>
            )}
          </div>
        </div>

        <MapView locations={[loc]} selectedIds={selected ? [loc._id] : []} height={380} />
      </div>

      {others.length > 0 && (
        <section aria-labelledby="nearby">
          <h2 id="nearby" className="mb-4 text-xl font-medium">Ще в цій області</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((l) => (
              <LocationCard key={l._id} location={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
