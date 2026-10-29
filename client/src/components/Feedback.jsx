import Button from './Button.jsx';

export function Spinner({ label = 'Завантаження…' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-mist" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-route" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100" role="alert">
      <p>{error.message || String(error)}</p>
      {onRetry && (
        <button className="mt-2 font-bold underline" onClick={onRetry}>
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action, to }) {
  return (
    <div className="glass p-8 text-center">
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      {text && <p className="mx-auto mb-4 max-w-md text-mist">{text}</p>}
      {action && to && (
        <Button to={to} variant="light">
          {action}
        </Button>
      )}
    </div>
  );
}
