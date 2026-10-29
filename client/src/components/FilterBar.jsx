/** Панель фільтрів каталогу: пошук, область, категорія, ціна, сортування */
export default function FilterBar({ filters, onChange, categories = [], regions = [], onReset }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <form className="panel space-y-4 p-4" onSubmit={(e) => e.preventDefault()} role="search">
      <div>
        <label className="label" htmlFor="f-q">Пошук</label>
        <input id="f-q" className="input" placeholder="Замок, озеро, вершина…" value={filters.q} onChange={set('q')} />
      </div>
      <div>
        <label className="label" htmlFor="f-region">Область</label>
        <select id="f-region" className="input" value={filters.region} onChange={set('region')}>
          <option value="">Усі області</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="label">Категорія</legend>
        <div className="flex flex-wrap gap-2">
          {[{ _id: '', name: 'Усі', icon: '' }, ...categories].map((c) => {
            const active = filters.category === c._id;
            return (
              <button
                key={c._id || 'all'}
                type="button"
                onClick={() => onChange({ ...filters, category: c._id })}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                  active ? 'border-fir bg-fir text-white' : 'border-line bg-white hover:border-fir'
                }`}
              >
                {c.icon && <span aria-hidden="true">{c.icon} </span>}
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div>
        <label className="label" htmlFor="f-price">
          Вхід до {filters.maxPrice === '' ? 'будь-якої ціни' : `${filters.maxPrice} грн`}
        </label>
        <input
          id="f-price"
          type="range"
          min="0"
          max="500"
          step="50"
          value={filters.maxPrice === '' ? 500 : filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value === '500' ? '' : e.target.value })}
          className="w-full accent-fir"
        />
      </div>
      <div>
        <label className="label" htmlFor="f-sort">Сортування</label>
        <select id="f-sort" className="input" value={filters.sort} onChange={set('sort')}>
          <option value="name">За назвою</option>
          <option value="region">За областю</option>
          <option value="price">Спочатку дешевші</option>
        </select>
      </div>
      <button type="button" onClick={onReset} className="text-sm font-semibold text-fir hover:underline">
        Скинути фільтри
      </button>
    </form>
  );
}
