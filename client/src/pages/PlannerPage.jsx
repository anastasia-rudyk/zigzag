import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import LocationCard from '../components/LocationCard.jsx';
import MapView from '../components/MapView.jsx';
import RouteRibbon from '../components/RouteRibbon.jsx';
import RouteStats from '../components/RouteStats.jsx';
import DayPlan from '../components/DayPlan.jsx';
import BudgetTable from '../components/BudgetTable.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useTrip } from '../context/TripContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatMinutes, pluralDays } from '../utils/format.js';

const PRICE_FIELDS = [
  ['fuelPer100', 'Витрата пального, л/100 км'],
  ['fuelPrice', 'Ціна пального, грн/л'],
  ['busPerKm', 'Проїзд автобусом, грн/км'],
  ['nightPrice', 'Ніч у готелі за номер, грн'],
  ['foodPerDay', 'Харчування на людину, грн/день'],
];

export default function PlannerPage() {
  const { user } = useAuth();
  const { selected, remove, toggle, clear } = useTrip();
  const navigate = useNavigate();

  const all = useAsync(() => Promise.all([api.locations(), api.meta()]), []);
  const [locations, meta] = all.data || [[], null];
  const byId = useMemo(() => Object.fromEntries(locations.map((l) => [l._id, l])), [locations]);

  const [form, setForm] = useState({ startCity: 'Львів', days: 2, people: 2, transport: 'car', roundTrip: false });
  const [prices, setPrices] = useState(null);
  const [showPrices, setShowPrices] = useState(false);
  const [result, setResult] = useState(null);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (meta && !prices) setPrices(meta.defaultPrices);
  }, [meta, prices]);

  // Будь-яка зміна вхідних даних робить попередній результат неактуальним
  useEffect(() => {
    setResult(null);
  }, [selected, form, prices]);

  const start = meta?.startCities.find((c) => c.name === form.startCity);
  const chosen = selected.map((id) => byId[id]).filter(Boolean);
  const set = (key, cast = (v) => v) => (e) =>
    setForm((f) => ({ ...f, [key]: cast(e.target.type === 'checkbox' ? e.target.checked : e.target.value) }));

  const payload = () => ({
    start,
    locationIds: chosen.map((l) => l._id),
    days: form.days,
    people: form.people,
    transport: form.transport,
    roundTrip: form.roundTrip,
    prices,
  });

  async function build() {
    setError(null);
    setBuilding(true);
    try {
      const r = await api.buildTrip(payload());
      setResult(r);
      setTitle(`${form.startCity}: ${pluralDays(form.days)}, ${chosen.length} місць`);
    } catch (e) {
      setError(e);
    } finally {
      setBuilding(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const trip = await api.saveTrip({ ...payload(), title });
      clear();
      navigate(`/trips/${trip._id}`);
    } catch (err) {
      setError(err);
      setSaving(false);
    }
  }

  if (all.loading) return <div className="page"><Spinner /></div>;
  if (all.error) return <div className="page"><ErrorNote error={all.error} onRetry={all.reload} /></div>;

  const ordered = result ? result.order.map((id) => byId[id]) : chosen;
  const line = result
    ? result.geometry || [
        [start.lat, start.lng],
        ...ordered.map((l) => [l.lat, l.lng]),
        ...(form.roundTrip ? [[start.lat, start.lng]] : []),
      ]
    : null;

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Конструктор подорожі</h1>
        <p className="text-slate-soft">Натискайте на маркери карти, щоб додати або прибрати місця.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="space-y-6">
          <section className="panel p-4" aria-labelledby="sel">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="sel" className="text-base font-medium">
                {result ? 'Оптимальний порядок' : 'Обрані місця'} ({chosen.length})
              </h2>
              {chosen.length > 0 && (
                <button onClick={clear} className="text-sm font-semibold text-slate-soft hover:text-ink">
                  Очистити
                </button>
              )}
            </div>
            {chosen.length === 0 ? (
              <EmptyState title="Подорож порожня" text="Додайте місця з каталогу або натисніть на маркери карти." action="Відкрити каталог" to="/catalog" />
            ) : (
              <div className="space-y-2">
                {ordered.map((l, i) => (
                  <LocationCard key={l._id} location={l} compact index={result ? i + 1 : undefined} onRemove={remove} />
                ))}
              </div>
            )}
          </section>

          <form
            className="panel space-y-4 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              build();
            }}
            aria-labelledby="params"
          >
            <h2 id="params" className="text-base font-medium">Параметри</h2>
            <div>
              <label className="label" htmlFor="p-start">Місто старту</label>
              <select id="p-start" className="input" value={form.startCity} onChange={set('startCity')}>
                {meta.startCities.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="p-days">Днів</label>
                <input id="p-days" type="number" min={meta.limits.minDays} max={meta.limits.maxDays} className="input" value={form.days} onChange={set('days', Number)} />
              </div>
              <div>
                <label className="label" htmlFor="p-people">Подорожніх</label>
                <input id="p-people" type="number" min="1" max={meta.limits.maxPeople} className="input" value={form.people} onChange={set('people', Number)} />
              </div>
            </div>
            <fieldset>
              <legend className="label">Транспорт</legend>
              <div className="grid grid-cols-2 gap-2">
                {[['car', 'Автомобіль'], ['bus', 'Автобус']].map(([v, label]) => (
                  <label key={v} className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-semibold ${form.transport === v ? 'border-fir bg-fir-light text-fir-dark' : 'border-line bg-white'}`}>
                    <input type="radio" name="transport" value={v} checked={form.transport === v} onChange={set('transport')} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.roundTrip} onChange={set('roundTrip')} className="h-4 w-4 accent-fir" />
              Повернутися до міста старту
            </label>

            <div>
              <button type="button" className="text-sm font-semibold text-fir hover:underline" onClick={() => setShowPrices((s) => !s)} aria-expanded={showPrices}>
                {showPrices ? 'Сховати ціни' : 'Змінити ціни для розрахунку бюджету'}
              </button>
              {showPrices && prices && (
                <div className="mt-3 space-y-2">
                  {PRICE_FIELDS.map(([key, label]) => (
                    <div key={key} className="grid grid-cols-[1fr_96px] items-center gap-2">
                      <label htmlFor={`pr-${key}`} className="text-sm">{label}</label>
                      <input id={`pr-${key}`} type="number" min="0" step="any" className="input py-1" value={prices[key]} onChange={(e) => setPrices((p) => ({ ...p, [key]: Number(e.target.value) }))} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <Button type="submit" size="lg" className="w-full" disabled={building || chosen.length === 0}>
                {building ? 'Будуємо маршрут…' : 'Побудувати маршрут'}
              </Button>
            ) : (
              <div className="rounded-lg bg-mist p-3 text-sm">
                Щоб побудувати маршрут,{' '}
                <Link to="/login" state={{ from: '/planner' }} className="font-semibold text-fir underline">увійдіть</Link> або{' '}
                <Link to="/register" state={{ from: '/planner' }} className="font-semibold text-fir underline">зареєструйтеся</Link>.
              </div>
            )}
            <ErrorNote error={error} />
          </form>
        </div>

        <div className="space-y-6">
          <MapView
            locations={locations}
            selectedIds={selected}
            order={result ? result.order : []}
            start={start}
            line={line}
            onMarkerClick={(l) => toggle(l._id)}
            height={result ? 440 : 620}
            fit={Boolean(result)}
            fitPoints={line || undefined}
          />

          {building && <Spinner label="Рахуємо матрицю відстаней і оптимізуємо порядок…" />}

          {result && (
            <section className="space-y-6" aria-labelledby="res">
              <h2 id="res" className="sr-only">Результат</h2>
              {result.warnings.map((w) => (
                <p key={w} className="rounded-lg border border-route bg-route-light/50 p-3 text-sm" role="status">{w}</p>
              ))}
              <RouteStats distanceKm={result.distanceKm} nnDistanceKm={result.nnDistanceKm} durationMin={result.durationMin} total={result.budget.total} />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="panel p-4">
                  <h3 className="mb-4 text-base font-medium">Маршрут</h3>
                  <RouteRibbon
                    stops={[{ name: start.name, note: 'старт' }, ...ordered.map((l) => ({ name: l.name, note: `огляд ${formatMinutes(l.visitMin)}` }))]}
                    legs={result.legsKm}
                    roundTrip={form.roundTrip}
                  />
                </div>
                <div className="space-y-6">
                  <div className="panel p-4">
                    <h3 className="mb-3 text-base font-medium">План по днях</h3>
                    <DayPlan plan={result.plan} byId={byId} days={form.days} maxPerDay={meta.limits.maxMinutesPerDay} />
                  </div>
                  <div className="panel p-4">
                    <h3 className="mb-3 text-base font-medium">Кошторис</h3>
                    <BudgetTable budget={result.budget} />
                  </div>
                </div>
              </div>

              <form onSubmit={save} className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="label" htmlFor="t-title">Назва подорожі</label>
                  <input id="t-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
                </div>
                <Button type="submit" variant="secondary" disabled={saving}>
                  {saving ? 'Зберігаємо…' : 'Зберегти подорож'}
                </Button>
              </form>
              <p className="text-xs text-slate-soft">
                Джерело відстаней: {result.source === 'osrm' ? 'дороги OSRM' : 'наближений розрахунок'}; обчислення {result.computeMs} мс.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
