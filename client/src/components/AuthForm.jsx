import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import { ErrorNote } from './Feedback.jsx';

/** Спільна форма входу та реєстрації */
export default function AuthForm({ mode, onSubmit }) {
  const isRegister = mode === 'register';
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/planner';

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="page max-w-md">
      <h1 className="mb-2 text-3xl font-bold">{isRegister ? 'Реєстрація' : 'Вхід'}</h1>
      <p className="mb-6 text-slate-soft">
        {isRegister
          ? 'Обліковий запис потрібен, щоб будувати й зберігати маршрути.'
          : 'Увійдіть, щоб будувати маршрути та бачити збережені подорожі.'}
      </p>

      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        {isRegister && (
          <div>
            <label className="label" htmlFor="a-name">Ім’я</label>
            <input id="a-name" className="input" autoComplete="name" value={values.name} onChange={set('name')} required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="a-email">Email</label>
          <input id="a-email" type="email" className="input" autoComplete="email" value={values.email} onChange={set('email')} required />
        </div>
        <div>
          <label className="label" htmlFor="a-pass">Пароль</label>
          <input
            id="a-pass"
            type="password"
            className="input"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={6}
            value={values.password}
            onChange={set('password')}
            required
          />
          {isRegister && <p className="mt-1 text-xs text-slate-soft">Щонайменше 6 символів</p>}
        </div>
        <ErrorNote error={error} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Зачекайте…' : isRegister ? 'Створити обліковий запис' : 'Увійти'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        {isRegister ? 'Уже маєте обліковий запис? ' : 'Ще немає облікового запису? '}
        <Link to={isRegister ? '/login' : '/register'} state={{ from }} className="font-semibold text-fir hover:underline">
          {isRegister ? 'Увійти' : 'Зареєструватися'}
        </Link>
      </p>
    </div>
  );
}
