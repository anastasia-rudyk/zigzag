/**
 * Вкладки категорій у вигляді «скляної» пігулки.
 * Використовуються на головній сторінці та в каталозі.
 */
export default function CategoryTabs({ categories = [], value, onChange, className = '' }) {
  const items = [{ _id: '', name: 'Усі' }, ...categories];

  return (
    <div
      className={`no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border-2 border-white/70 p-1 ${className}`}
      role="tablist"
      aria-label="Категорії"
    >
      {items.map((c) => {
        const active = value === c._id;
        return (
          <button
            key={c._id || 'all'}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c._id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors sm:px-5 ${
              active ? 'bg-white/30 font-bold text-white' : 'text-white/85 hover:bg-white/10'
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
