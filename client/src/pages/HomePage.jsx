import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import RouteRibbon from '../components/RouteRibbon.jsx';
import LocationCard from '../components/LocationCard.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';

const SAMPLE_STOPS = [
  { name: 'Львів', note: 'старт' },
  { name: 'Олеський замок', note: 'огляд 1 год 30 хв' },
  { name: 'Підгорецький замок', note: 'огляд 1 год' },
  { name: 'Золочівський замок', note: 'огляд 1 год' },
];

const STEPS = [
  ['Оберіть місця', 'Знайдіть у каталозі замки, озера, вершини чи гастрономічні зупинки й додайте їх до подорожі.'],
  ['Задайте параметри', 'Вкажіть місто старту, кількість днів, подорожніх і транспорт.'],
  ['Отримайте маршрут', 'Система знайде найкоротший порядок відвідування, розкладе його по днях і порахує бюджет.'],
];

export default function HomePage() {
  const { data, loading, error, reload } = useAsync(() => api.locations({ sort: 'region' }), []);
  const featured = (data || []).filter((_, i) => i % 4 === 0).slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="page grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="mb-5 text-4xl font-bold leading-[1.1] sm:text-5xl">
            Плануйте подорожі Україною без зайвих кілометрів
          </h1>
          <p className="mb-8 max-w-xl text-lg text-slate-soft">
            Оберіть місця, які хочете побачити, а UkrRoute складе найкоротший маршрут, розкладе його по днях і
            порахує, скільки коштуватиме поїздка.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/catalog" size="lg">
              Обрати місця
            </Button>
            <Button to="/planner" size="lg" variant="outline">
              Відкрити конструктор
            </Button>
          </div>
        </div>

        <aside className="panel p-6" aria-label="Приклад маршруту">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-base font-medium">Золота підкова Львівщини</h2>
            <span className="text-sm text-slate-soft">1 день</span>
          </div>
          <RouteRibbon stops={SAMPLE_STOPS} legs={[72, 9, 24]} />
          <p className="mt-4 border-t border-line pt-4 text-sm text-slate-soft">
            Приклад: відстані наближені. Побудуйте власний маршрут у конструкторі.
          </p>
        </aside>
      </section>

      <section className="page" aria-labelledby="how">
        <h2 id="how" className="mb-6 text-2xl font-medium">Як це працює</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-4">
              <span className="font-display text-3xl font-bold text-route">{i + 1}</span>
              <div>
                <h3 className="mb-1 text-base font-medium">{title}</h3>
                <p className="text-sm text-slate-soft">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="page" aria-labelledby="featured">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="featured" className="text-2xl font-medium">Куди поїхати</h2>
          <Link to="/catalog" className="text-sm font-semibold text-fir hover:underline">
            Увесь каталог
          </Link>
        </div>
        {loading && <Spinner />}
        <ErrorNote error={error} onRetry={reload} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((loc) => (
            <LocationCard key={loc._id} location={loc} />
          ))}
        </div>
      </section>
    </div>
  );
}
