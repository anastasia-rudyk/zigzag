import { useState } from 'react';
import Button from '../components/Button.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import { Spinner, ErrorNote } from '../components/Feedback.jsx';
import { api } from '../api/client.js';
import { useAsync } from '../api/useAsync.js';
import { formatUAH } from '../utils/format.js';

const EMPTY = { name: '', description: '', region: '', categoryId: '', lat: '', lng: '', visitMin: 60, ticketPrice: 0 };

export default function AdminPage() {
  const list = useAsync(() => Promise.all([api.locations(), api.categories()]), []);
  const [items, categories] = list.data || [[], []];
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
    const data = { ...form, lat: Number(form.lat), lng: Number(form.lng), visitMin: Number(form.visitMin), ticketPrice: Number(form.ticketPrice) };
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
    if (!window.confirm(`Видалити локацію «${loc.name}»?`)) return;
    try {
      await api.deleteLocation(loc._id);
      list.reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="page space-y-8">
      <h1 className="text-3xl font-bold">Адмін-панель</h1>

      <form onSubmit={submit} className="panel grid gap-4 p-5 md:grid-cols-2">
        <h2 className="text-lg font-medium md:col-span-2">{editingId ? 'Редагування локації' : 'Нова локація'}</h2>
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
        <div className="md:col-span-2">
          <ErrorNote error={error} />
        </div>
        <div className="flex gap-3 md:col-span-2">
          <Button type="submit" variant="secondary" disabled={busy}>
            {editingId ? 'Зберегти зміни' : 'Додати локацію'}
          </Button>
          {editingId && <Button variant="ghost" onClick={reset}>Скасувати</Button>}
        </div>
      </form>

      <section aria-labelledby="all">
        <h2 id="all" className="mb-4 text-lg font-medium">Усі локації ({items.length})</h2>
        {list.loading && <Spinner />}
        <ErrorNote error={list.error} onRetry={list.reload} />
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-slate-soft">
              <tr>
                <th className="p-3 font-semibold">Назва</th>
                <th className="p-3 font-semibold">Категорія</th>
                <th className="p-3 font-semibold">Область</th>
                <th className="p-3 text-right font-semibold">Квиток</th>
                <th className="p-3"><span className="sr-only">Дії</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((loc) => (
                <tr key={loc._id} className="border-b border-line last:border-0">
                  <td className="p-3 font-semibold">{loc.name}</td>
                  <td className="p-3"><CategoryBadge category={loc.categoryId} /></td>
                  <td className="p-3">{loc.region}</td>
                  <td className="p-3 text-right tabular-nums">{formatUAH(loc.ticketPrice)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => edit(loc)}>Редагувати</Button>
                      <Button variant="danger" size="sm" onClick={() => remove(loc)}>Видалити</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
