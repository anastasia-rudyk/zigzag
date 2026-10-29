// Кольори категорій: точка на карті, мітка й запасний фон картки без фото
export const categoryTone = {
  mountains: { color: '#8FB3FF', gradient: 'linear-gradient(160deg, #3B4F7A 0%, #142033 100%)' },
  water: { color: '#5FD3E6', gradient: 'linear-gradient(160deg, #1F6E7A 0%, #0B2A30 100%)' },
  parks: { color: '#8FD9B6', gradient: 'linear-gradient(160deg, #2F8F68 0%, #0F2A20 100%)' },
  castles: { color: '#E8B77A', gradient: 'linear-gradient(160deg, #7A5532 0%, #2A1A0E 100%)' },
  architecture: { color: '#D6A6F0', gradient: 'linear-gradient(160deg, #5E3F7A 0%, #1E1430 100%)' },
  food: { color: '#FFB27F', gradient: 'linear-gradient(160deg, #A0441A 0%, #331408 100%)' },
};

const fallback = { color: '#A9BDB5', gradient: 'linear-gradient(160deg, #2A3A35 0%, #0D1A16 100%)' };

export const toneOf = (category) => categoryTone[category?.slug] || fallback;

export default function CategoryBadge({ category, className = '' }) {
  if (!category) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-night/50 px-2.5 py-0.5 text-xs font-semibold backdrop-blur ${className}`}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: toneOf(category).color }} aria-hidden="true" />
      {category.name}
    </span>
  );
}
