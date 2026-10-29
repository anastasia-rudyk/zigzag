const uah = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });

export const formatUAH = (n) => `${uah.format(Math.round(n || 0))} грн`;

const km1 = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });

export function formatKm(n) {
  const v = n || 0;
  if (v > 0 && v < 1) return 'менше 1 км';
  return v < 10 ? `${km1.format(v)} км` : `${uah.format(Math.round(v))} км`;
}

export function formatMinutes(min) {
  const m = Math.round(min || 0);
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest} хв`;
  return rest ? `${h} год ${rest} хв` : `${h} год`;
}

export function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} дні`;
  return `${n} днів`;
}

export const transportLabel = { car: 'Автомобіль', bus: 'Автобус' };
