import { NavLink, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrip } from '../context/TripContext.jsx';

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-fir-light text-fir-dark' : 'text-ink hover:bg-white'
  }`;

export default function Layout() {
  const { user, signOut } = useAuth();
  const { selected } = useTrip();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = (
    <>
      <NavLink to="/catalog" className={navClass} onClick={close}>
        Каталог
      </NavLink>
      <NavLink to="/planner" className={navClass} onClick={close}>
        Конструктор
        {selected.length > 0 && (
          <span className="ml-2 rounded-full bg-route px-2 py-0.5 text-xs text-white">{selected.length}</span>
        )}
      </NavLink>
      {user && (
        <NavLink to="/trips" className={navClass} onClick={close}>
          Мої подорожі
        </NavLink>
      )}
      {user?.role === 'admin' && (
        <NavLink to="/admin" className={navClass} onClick={close}>
          Адмін-панель
        </NavLink>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-mist/90 backdrop-blur">
        <div className="page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2" onClick={close}>
            <Logo />
            <span className="font-display text-lg font-bold">UkrRoute</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Головна навігація">
            {links}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="text-sm text-slate-soft">{user.name}</span>
                <button onClick={signOut} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white">
                  Вийти
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-fir-dark">
                Увійти
              </Link>
            )}
          </div>

          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="page flex flex-col gap-1 pb-4 md:hidden" aria-label="Мобільна навігація">
            {links}
            {user ? (
              <button onClick={() => { signOut(); close(); }} className="rounded-lg px-3 py-2 text-left text-sm font-semibold">
                Вийти ({user.name})
              </button>
            ) : (
              <NavLink to="/login" className={navClass} onClick={close}>
                Увійти
              </NavLink>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line py-6 text-sm text-slate-soft">
        <div className="page flex flex-col justify-between gap-2 sm:flex-row">
          <span>UkrRoute — курсова робота з дисципліни «Веб-технології та веб-дизайн»</span>
          <span>Карти © OpenStreetMap, маршрутизація OSRM</span>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 24 C 8 12, 24 20, 24 8" stroke="#E8590C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="8" cy="24" r="5" fill="#1F5E4A" />
      <circle cx="24" cy="8" r="5" fill="#E8590C" />
    </svg>
  );
}
