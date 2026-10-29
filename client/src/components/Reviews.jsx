import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';
import Button from './Button.jsx';
import { Spinner, ErrorNote } from './Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { useAuth } from '../context/AuthContext.jsx';

const dateFmt = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * Відгуки про локацію: форма (одна оцінка від користувача, повторне надсилання
 * оновлює її) і список. onStats повідомляє сторінку про новий середній рейтинг.
 */
export default function Reviews({ locationId, onStats }) {
  const { user } = useAuth();
  const list = useAsync(() => api.reviews(locationId), [locationId]);
  const reviews = list.data || [];
  const mine = user && reviews.find((r) => r.userId?._id === user._id);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Якщо відгук уже є — підставляємо його у форму для редагування
  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setText(mine.text);
    }
  }, [mine?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e) {
    e.preventDefault();
    if (!rating) {
      setError(new Error('Оберіть оцінку від 1 до 5 зірок'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { review, ratingAvg, ratingCount } = await api.saveReview(locationId, rating, text);
      list.setData([review, ...reviews.filter((r) => r._id !== review._id)]);
      onStats?.({ ratingAvg, ratingCount });
      setSaved(true);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function remove(review) {
    if (!window.confirm('Видалити відгук?')) return;
    try {
      const stats = await api.deleteReview(review._id);
      list.setData(reviews.filter((r) => r._id !== review._id));
      onStats?.(stats);
      if (mine && review._id === mine._id) {
        setRating(0);
        setText('');
        setSaved(false);
      }
    } catch (err) {
      setError(err);
    }
  }

  return (
    <section className="glass p-6" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="mb-5 text-xl font-bold">
        Відгуки {reviews.length > 0 && <span className="font-sans text-base font-normal text-mist">({reviews.length})</span>}
      </h2>

      {user ? (
        <form onSubmit={submit} className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold">{mine ? 'Ваш відгук' : 'Оцініть це місце'}</span>
            <StarRating
              value={rating}
              onChange={(v) => {
                setRating(v);
                setSaved(false);
              }}
              size={28}
            />
          </div>
          <label className="sr-only" htmlFor="review-text">Текст відгуку</label>
          <textarea
            id="review-text"
            rows="3"
            maxLength={1000}
            className="input"
            placeholder="Що сподобалося? Коли краще приїжджати? (необов’язково)"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSaved(false);
            }}
          />
          <ErrorNote error={error} />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="light" disabled={busy}>
              {busy ? 'Зберігаємо…' : mine ? 'Оновити відгук' : 'Опублікувати відгук'}
            </Button>
            {saved && <span className="text-sm text-fir-light" role="status">Відгук збережено</span>}
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-mist">
          <Link to="/login" className="font-bold text-route-light underline">Увійдіть</Link>, щоб оцінити це місце.
        </p>
      )}

      {list.loading && <Spinner label="Завантажуємо відгуки…" />}
      {!list.loading && reviews.length === 0 && (
        <p className="text-mist">Ще ніхто не залишив відгук. Будьте першими.</p>
      )}

      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r._id} className="border-b border-white/10 pb-4 last:border-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fir font-display text-sm font-bold">
                  {r.userId?.name?.[0]?.toUpperCase() || '?'}
                </span>
                <div>
                  <p className="text-sm font-bold">{r.userId?.name || 'Користувач'}</p>
                  <p className="text-xs text-mist">{dateFmt.format(new Date(r.updatedAt || r.createdAt))}</p>
                </div>
              </div>
              <StarRating value={r.rating} />
            </div>
            {r.text && <p className="mt-2 text-sm">{r.text}</p>}
            {user && (r.userId?._id === user._id || user.role === 'admin') && (
              <button onClick={() => remove(r)} className="mt-2 text-xs font-bold text-mist hover:text-red-200">
                Видалити
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
