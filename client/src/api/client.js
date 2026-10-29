const TOKEN_KEY = 'ukrroute_token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t) => {
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* сховище недоступне — працюємо без збереження */
    }
  },
};

/** Обгортка над fetch: JSON, токен авторизації, зрозумілі помилки */
export async function request(path, { method = 'GET', body, query } = {}) {
  const url = new URL(`/api${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Немає з’єднання із сервером. Перевірте, чи запущено API.');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Помилка ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  meta: () => request('/meta'),

  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  me: () => request('/auth/me'),
  toggleFavorite: (id) => request(`/auth/favorites/${id}`, { method: 'POST' }),

  categories: () => request('/categories'),
  regions: () => request('/locations/regions'),
  locations: (filters) => request('/locations', { query: filters }),
  location: (id) => request(`/locations/${id}`),
  createLocation: (data) => request('/locations', { method: 'POST', body: data }),
  updateLocation: (id, data) => request(`/locations/${id}`, { method: 'PUT', body: data }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: 'DELETE' }),

  buildTrip: (data) => request('/trips/build', { method: 'POST', body: data }),
  saveTrip: (data) => request('/trips', { method: 'POST', body: data }),
  trips: () => request('/trips'),
  trip: (id) => request(`/trips/${id}`),
  renameTrip: (id, title) => request(`/trips/${id}`, { method: 'PATCH', body: { title } }),
  deleteTrip: (id) => request(`/trips/${id}`, { method: 'DELETE' }),
};
