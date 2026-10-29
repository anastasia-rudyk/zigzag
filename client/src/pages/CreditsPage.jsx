import { Link } from 'react-router-dom';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';

/** Автори та ліцензії всіх фото — вимога ліцензій Creative Commons */
export default function CreditsPage() {
  const { data, loading, error, reload } = useAsync(() => api.locations({ sort: 'name' }), []);
  const withPhoto = (data || []).filter((l) => l.photoCredit);

  return (
    <div className="page max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Джерела фото</h1>
      <p className="mb-6 text-mist">
        Фото локацій взято з Wikimedia Commons і використано відповідно до вільних ліцензій їхніх авторів.
      </p>
      {loading && <Spinner />}
      <ErrorNote error={error} onRetry={reload} />
      <ul className="glass divide-y divide-white/10">
        {withPhoto.map((l) => (
          <li key={l._id} className="flex items-center gap-4 p-3">
            <img src={l.photos[0]} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
            <div className="min-w-0 text-sm">
              <Link to={`/locations/${l._id}`} className="font-bold hover:text-route-light">{l.name}</Link>
              <p className="text-mist">
                <a href={l.photoCredit.source} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                  {l.photoCredit.author}
                </a>
                ,{' '}
                {l.photoCredit.licenseUrl ? (
                  <a href={l.photoCredit.licenseUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                    {l.photoCredit.license}
                  </a>
                ) : (
                  l.photoCredit.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
