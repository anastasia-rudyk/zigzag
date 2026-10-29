import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import CategoryBadge, { toneOf } from '../components/CategoryBadge.jsx';
import PhotoCard from '../components/PhotoCard.jsx';
import MapView from '../components/MapView.jsx';
import StarRating from '../components/StarRating.jsx';
import Reviews from '../components/Reviews.jsx';
import Icon from '../components/Icon.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useTrip } from '../context/TripContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useBackdrop } from '../context/BackdropContext.jsx';
import { formatMinutes, formatUAH } from '../utils/format.js';

export default function LocationPage() {
  const { id } = useParams();
  const { isSelected, toggle } = useTrip();
  const { user, toggleFavorite } = useAuth();

  const { data: loc, loading, error, reload } = useAsync(() => api.location(id), [id]);
  const nearby = useAsync(() => (loc ? api.locations({ region: loc.region }) : Promise.resolve([])), [loc?._id]);
  const [stats, setStats] = useState(null);

  useEffect(() => setStats(null), [id]);
  useBackdrop(loc?.photos?.[0]);

  if (loading) return <div className="page"><Spinner /></div>;
  if (error) return <div className="page"><ErrorNote error={error} onRetry={reload} /></div>;

  const selected = isSelected(loc._id);
  const favorite = user?.favorites?.some((f) => String(f) === loc._id);
  const rating = stats || { ratingAvg: loc.ratingAvg, ratingCount: loc.ratingCount };
  const others = (nearby.data || []).filter((l) => l._id !== loc._id).slice(0, 3);
  const photo = loc.photos?.[0];
  const credit = loc.photoCredit;

  return (
    <div className="page space-y-8">
      <nav className="text-sm text-mist" aria-label="Хлібні крихти">
        <Link to="/catalog" className="hover:text-ink">Каталог</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{loc.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-3xl border border-white/20 shadow-glass" style={{ background: toneOf(loc.categoryId).gradient }}>
        {photo && <img src={photo} alt={loc.name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" aria-hidden="true" />
        <div className="relative flex min-h-[22rem] flex-col justify-end p-6 sm:min-h-[28rem] sm:p-10">
          <CategoryBadge category={loc.categoryId} className="mb-3 self-start" />
          <h1 className="text-3xl font-bold sm:text-5xl">{loc.name}</h1>
          <p className="mt-2 text-white/85">{loc.region} область</p>
          <div className="mt-3">
            <StarRating value={rating.ratingAvg} showValue count={rating.ratingCount} size={20} />
          </div>
        </div>
        {credit && (
          <p className="absolute right-3 top-3 max-w-[70%] rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/80 backdrop-blur">
            Фото:{' '}
            <a href={credit.source} target="_blank" rel="noreferrer" className="underline">
              {credit.author}
            </a>
            , {credit.license}
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass space-y-6 p-6">
          <p className="text-lg leading-relaxed">{loc.description}</p>

          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <dt className="flex items-center gap-1.5 text-xs text-mist"><Icon name="clock" size={14} /> Час на огляд</dt>
              <dd className="font-display text-lg font-bold">{formatMinutes(loc.visitMin)}</dd>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <dt className="flex items-center gap-1.5 text-xs text-mist"><Icon name="ticket" size={14} /> Вхідний квиток</dt>
              <dd className="font-display text-lg font-bold">{loc.ticketPrice ? formatUAH(loc.ticketPrice) : 'Безкоштовно'}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Button variant={selected ? 'glass' : 'primary'} size="lg" onClick={() => toggle(loc._id)} aria-pressed={selected}>
              <Icon name={selected ? 'check' : 'plus'} />
              {selected ? 'У маршруті' : 'Додати до маршруту'}
            </Button>
            {selected && <Button to="/planner" variant="light" size="lg">До конструктора</Button>}
            {user && (
              <Button variant="ghost" size="lg" onClick={() => toggleFavorite(loc._id)} aria-pressed={favorite}>
                {favorite ? '★ В обраному' : '☆ В обране'}
              </Button>
            )}
          </div>
        </div>

        <MapView locations={[loc]} selectedIds={selected ? [loc._id] : []} height={360} />
      </div>

      <Reviews locationId={loc._id} onStats={setStats} />

      {others.length > 0 && (
        <section aria-labelledby="nearby">
          <h2 id="nearby" className="mb-4 text-xl font-bold">Ще в цій області</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((l) => (
              <PhotoCard key={l._id} location={l} size="sm" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
