import Icon from './Icon.jsx';

/** Панель фільтрів каталогу: пошук, область, ціна, сортування */
export default function FilterBar({ filters, onChange, regions = [], onReset }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <form
      className="glass grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end"
      onSubmit={(e) => e.preventDefault()}
      role="search"
    >
      <div className="relative">
        <label className="sr-only" htmlFor="f-q">Пошук</label>
        <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
        <input id="f-q" className="input pl-10" placeholder="Замок, озеро, вершина…" value={filters.q} onChange={set('q')} />
      </div>
      <div>
        <label className="sr-only" htmlFor="f-region">Область</label>
        <select id="f-region" className="input" value={filters.region} onChange={set('region')}>
          <option value="">Усі області</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="sr-only" htmlFor="f-price">Ціна квитка</label>
        <select id="f-price" className="input" value={filters.maxPrice} onChange={set('maxPrice')}>
          <option value="">Будь-яка ціна</option>
          <option value="0">Безкоштовні</option>
          <option value="100">До 100 грн</option>
          <option value="200">До 200 грн</option>
        </select>
      </div>
      <div>
        <label className="sr-only" htmlFor="f-sort">Сортування</label>
        <select id="f-sort" className="input" value={filters.sort} onChange={set('sort')}>
          <option value="rating">Спочатку найкращі</option>
          <option value="name">За назвою</option>
          <option value="region">За областю</option>
          <option value="price">Спочатку дешевші</option>
        </select>
      </div>
      <button type="button" onClick={onReset} className="rounded-full px-4 py-2 text-sm font-bold text-route-light hover:bg-white/10">
        Скинути
      </button>
    </form>
  );
}
