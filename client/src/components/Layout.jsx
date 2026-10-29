import { NavLink, Outlet, Link } from 'react-router-dom';
import Backdrop from './Backdrop.jsx';
import Icon from './Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrip } from '../context/TripContext.jsx';

const NAV = [
  { to: '/', label: 'Головна', icon: 'home', end: true },
  { to: '/catalog', label: 'Каталог', icon: 'grid' },
  { to: '/planner', label: 'Маршрут', icon: 'route', badge: true },
  { to: '/trips', label: 'Подорожі', icon: 'bookmark' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const { selected } = useTrip();
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="relative flex min-h-screen flex-col">
      <Backdrop />

      <header className="no-print">
        <div className="page flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2" aria-label="Zigzag — на головну">
            <Logo />
            <span className="font-display text-lg font-bold">Zigzag</span>
          </Link>

          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="glass hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/15 sm:flex"
              >
                <Icon name="settings" size={16} />
                Адмін-панель
              </Link>
            )}
            {user ? (
              <>
                <span className="hidden font-display text-sm sm:inline">Привіт, {firstName}!</span>
                <Link
                  to="/trips"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/40 bg-fir font-display font-bold"
                  title="Мої подорожі"
                >
                  {firstName?.[0]?.toUpperCase()}
                </Link>
                <button
                  onClick={signOut}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-mist hover:bg-white/10 hover:text-ink"
                  aria-label="Вийти"
                  title="Вийти"
                >
                  <Icon name="logout" size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-night hover:bg-route-light">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-36 pt-2">
        <Outlet />
      </main>

      <footer className="no-print pb-28 text-xs text-mist">
        <div className="page flex flex-col justify-between gap-1 sm:flex-row">
          <span>Zigzag — курсова робота з дисципліни «Веб-технології та веб-дизайн»</span>
          <span>
            Карти © OpenStreetMap і CARTO, фото з{' '}
            <Link to="/credits" className="underline hover:text-ink">
              Wikimedia Commons
            </Link>
          </span>
        </div>
      </footer>

      <nav
        className="no-print fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
        aria-label="Головна навігація"
      >
        <ul className="flex items-center gap-1 rounded-full bg-white/95 p-1.5 text-night shadow-glass backdrop-blur">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex h-12 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors ${
                    isActive ? 'bg-night text-white' : 'hover:bg-night/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} size={22} />
                    <span className={isActive ? 'inline' : 'sr-only sm:not-sr-only'}>{item.label}</span>
                    {item.badge && selected.length > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-route px-1 text-[11px] text-white">
                        {selected.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 26 L12 14 L19 22 L26 6" stroke="#FF7A2F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="26" r="4" fill="#8FD9B6" />
      <circle cx="26" cy="6" r="4" fill="#FF7A2F" />
    </svg>
  );
}
