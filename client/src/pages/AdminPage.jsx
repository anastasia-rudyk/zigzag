import { useState } from 'react';
import Button from '../components/Button.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import LocationCard from '../components/LocationCard.jsx';
import StarRating from '../components/StarRating.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { formatUAH } from '../utils/format.js';

const EMPTY = {
  name: '', description: '', region: '', categoryId: '', lat: '', lng: '', visitMin: 60, ticketPrice: 0,
  photo: '', photoAuthor: '', photoLicense: '', photoSource: '',
};

export default function AdminPage() {
  const list = useAsync(() => Promise.all([api.locations(), api.categories()]), []);
  const [items, categories] = list.data || [[], []];
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const shown = items.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));

  function edit(loc) {
    setEditingId(loc._id);
    setForm({
      name: loc.name,
      description: loc.description,
      region: loc.region,
      categoryId: loc.categoryId?._id || '',
      lat: loc.lat,
      lng: loc.lng,
      visitMin: loc.visitMin,
      ticketPrice: loc.ticketPrice,
      photo: loc.photos?.[0] || '',
      photoAuthor: loc.photoCredit?.author || '',
      photoLicense: loc.photoCredit?.license || '',
      photoSource: loc.photoCredit?.source || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { photo, photoAuthor, photoLicense, photoSource, ...rest } = form;
    const data = {
      ...rest,
      lat: Number(form.lat),
      lng: Number(form.lng),
      visitMin: Number(form.visitMin),
      ticketPrice: Number(form.ticketPrice),
      photos: photo ? [photo] : [],
      photoCredit: photo ? { author: photoAuthor, license: photoLicense, source: photoSource } : undefined,
    };
    try {
      if (editingId) await api.updateLocation(editingId, data);
      else await api.createLocation(data);
      reset();
      list.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function remove(loc) {
    if (!window.confirm(`Видалити локацію «${loc.name}» разом із відгуками?`)) return;
    try {
      await api.deleteLocation(loc._id);
      list.reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="page space-y-8">
      <h1 className="text-3xl font-bold sm:text-5xl">Адмін-панель</h1>

      <form onSubmit={submit} className="glass grid gap-4 p-5 md:grid-cols-2">
        <h2 className="text-lg font-bold md:col-span-2">{editingId ? 'Редагування локації' : 'Нова локація'}</h2>
        <Field id="ad-name" label="Назва" className="md:col-span-2">
          <input id="ad-name" className="input" value={form.name} onChange={set('name')} required />
        </Field>
        <Field id="ad-desc" label="Опис" className="md:col-span-2">
          <textarea id="ad-desc" rows="3" className="input" value={form.description} onChange={set('description')} />
        </Field>
        <Field id="ad-region" label="Область">
          <input id="ad-region" className="input" value={form.region} onChange={set('region')} placeholder="Львівська" required />
        </Field>
        <Field id="ad-cat" label="Категорія">
          <select id="ad-cat" className="input" value={form.categoryId} onChange={set('categoryId')} required>
            <option value="">Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field id="ad-lat" label="Широта">
          <input id="ad-lat" type="number" step="any" min="44" max="53" className="input" value={form.lat} onChange={set('lat')} required />
        </Field>
        <Field id="ad-lng" label="Довгота">
          <input id="ad-lng" type="number" step="any" min="22" max="41" className="input" value={form.lng} onChange={set('lng')} required />
        </Field>
        <Field id="ad-visit" label="Час на огляд, хв">
          <input id="ad-visit" type="number" min="0" max="720" className="input" value={form.visitMin} onChange={set('visitMin')} />
        </Field>
        <Field id="ad-price" label="Ціна квитка, грн">
          <input id="ad-price" type="number" min="0" className="input" value={form.ticketPrice} onChange={set('ticketPrice')} />
        </Field>

        <fieldset className="grid gap-4 rounded-2xl border border-white/10 p-4 md:col-span-2 md:grid-cols-2">
          <legend className="px-2 text-sm font-bold">Фото (Wikimedia Commons або власне)</legend>
          <Field id="ad-photo" label="Посилання на зображення" className="md:col-span-2">
            <input id="ad-photo" type="url" className="input" value={form.photo} onChange={set('photo')} placeholder="https://upload.wikimedia.org/…" />
          </Field>
          <Field id="ad-author" label="Автор фото">
            <input id="ad-author" className="input" value={form.photoAuthor} onChange={set('photoAuthor')} />
          </Field>
          <Field id="ad-license" label="Ліцензія">
            <input id="ad-license" className="input" value={form.photoLicense} onChange={set('photoLicense')} placeholder="CC BY-SA 4.0" />
          </Field>
          <Field id="ad-source" label="Сторінка джерела" className="md:col-span-2">
            <input id="ad-source" type="url" className="input" value={form.photoSource} onChange={set('photoSource')} placeholder="https://commons.wikimedia.org/wiki/File:…" />
          </Field>
          {form.photo && <img src={form.photo} alt="Попередній перегляд" className="h-40 w-full rounded-xl object-cover md:col-span-2" />}
        </fieldset>

        <div className="md:col-span-2">
          <ErrorNote error={error} />
        </div>
        <div className="flex gap-3 md:col-span-2">
          <Button type="submit" variant="light" disabled={busy}>
            {editingId ? 'Зберегти зміни' : 'Додати локацію'}
          </Button>
          {editingId && <Button variant="ghost" onClick={reset}>Скасувати</Button>}
        </div>
      </form>

      <section aria-labelledby="all" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="all" className="text-lg font-bold">Усі локації ({items.length})</h2>
          <input className="input max-w-xs" placeholder="Знайти локацію…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Знайти локацію" />
        </div>
        {list.loading && <Spinner />}
        <ErrorNote error={list.error} onRetry={list.reload} />
        <ul className="grid gap-3 lg:grid-cols-2">
          {shown.map((loc) => (
            <li key={loc._id} className="glass space-y-2 p-3">
              <LocationCard location={loc} />
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <CategoryBadge category={loc.categoryId} />
                  <StarRating value={loc.ratingAvg} showValue count={loc.ratingCount} size={14} />
                  <span className="text-mist">{formatUAH(loc.ticketPrice)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="glass" size="sm" onClick={() => edit(loc)}>Редагувати</Button>
                  <Button variant="danger" size="sm" onClick={() => remove(loc)}>Видалити</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({ id, label, className = '', children }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
