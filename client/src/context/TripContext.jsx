import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'zigzag_selection';
const TripContext = createContext(null);

function loadSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Обрані для подорожі локації спільні для всіх сторінок:
 * додати можна з каталогу, сторінки локації або карти конструктора.
 */
export function TripProvider({ children }) {
  const [selected, setSelected] = useState(loadSelection); // масив id

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      /* сховище недоступне */
    }
  }, [selected]);

  const isSelected = (id) => selected.includes(id);
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const remove = (id) => setSelected((s) => s.filter((x) => x !== id));
  const clear = () => setSelected([]);

  return (
    <TripContext.Provider value={{ selected, isSelected, toggle, remove, clear, setSelected }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
