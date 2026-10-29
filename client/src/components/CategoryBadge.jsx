export const categoryTone = {
  nature: { badge: 'bg-fir-light text-fir-dark', band: '#1F5E4A' },
  history: { badge: 'bg-amber-100 text-amber-900', band: '#8A5A1F' },
  architecture: { badge: 'bg-sky-100 text-sky-900', band: '#2F4A7A' },
  food: { badge: 'bg-route-light text-route-dark', band: '#E8590C' },
};

const fallback = { badge: 'bg-line text-ink', band: '#5B6E73' };

export const toneOf = (category) => categoryTone[category?.slug] || fallback;

export default function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneOf(category).badge}`}>
      <span aria-hidden="true">{category.icon}</span>
      {category.name}
    </span>
  );
}
