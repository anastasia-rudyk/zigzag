import Button from './Button.jsx';

export function Spinner({ label = 'Завантаження…' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-slate-soft" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-fir" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
      <p>{error.message || String(error)}</p>
      {onRetry && (
        <button className="mt-2 font-semibold underline" onClick={onRetry}>
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action, to }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
      <h3 className="mb-2 text-lg">{title}</h3>
      {text && <p className="mx-auto mb-4 max-w-md text-slate-soft">{text}</p>}
      {action && to && (
        <Button to={to} variant="secondary">
          {action}
        </Button>
      )}
    </div>
  );
}
