/**
 * Отримання фото локацій із Wikimedia Commons через MediaWiki API.
 * Для кожного фото зберігаються автор, ліцензія та посилання на сторінку файлу,
 * щоб коректно вказати авторство (вимога ліцензій Creative Commons).
 *
 * Результати кешуються у photos.cache.json — повторний seed не робить запитів,
 * а кеш можна закомітити, щоб на іншому комп'ютері фото підтягувалися без мережі.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'ZigzagCoursework/1.0 (student project; https://github.com/anastasia-rudyk/zigzag)';
const THUMB_WIDTH = 1280;
const CACHE_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'photos.cache.json');

const EXCLUDE = /(map|karte|flag|coat[ _]of[ _]arms|logo|stamp|plan|scheme|banner|interior|інтер|diagram|\.svg|\.tif)/i;
const FREE_LICENSE = /(cc|creative commons|public domain|pd|gfdl|attribution)/i;

const stripHtml = (s = '') =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/** Перетворює сторінку з imageinfo на запис фото або null, якщо файл не підходить */
export function toPhoto(page) {
  const info = page?.imageinfo?.[0];
  if (!info || page.missing) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime || '')) return null;

  const meta = info.extmetadata || {};
  const license = stripHtml(meta.LicenseShortName?.value) || '';
  if (!FREE_LICENSE.test(license)) return null;

  const author = stripHtml(meta.Artist?.value) || 'Невідомий автор';
  return {
    url: info.thumburl || info.url,
    width: info.width,
    height: info.height,
    title: page.title,
    credit: {
      author: author.length > 80 ? `${author.slice(0, 77)}…` : author,
      license,
      licenseUrl: meta.LicenseUrl?.value || null,
      source: info.descriptionurl,
    },
  };
}

/** Оцінка «придатності» фото як обкладинки локації */
export function scorePhoto(photo, keywords = []) {
  if (!photo || EXCLUDE.test(photo.title)) return -Infinity;
  const ratio = photo.width / photo.height;
  if (photo.width < 1000 || ratio < 1.1 || ratio > 2.4) return -Infinity; // тільки горизонтальні фото
  const title = photo.title.toLowerCase();
  let score = Math.min(photo.width, 6000) / 1000; // більша роздільна здатність — краще
  if (ratio >= 1.3 && ratio <= 1.8) score += 2; // класичні пропорції 3:2, 16:9
  if (keywords.some((k) => title.includes(k.toLowerCase()))) score += 3;
  if (/\bRB\b|quality|featured/i.test(photo.title)) score += 1; // фото конкурсів Wiki Loves
  return score;
}

async function api(params, fetchImpl) {
  const url = new URL(API);
  Object.entries({
    format: 'json',
    formatversion: '2',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: String(THUMB_WIDTH),
    ...params,
  }).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetchImpl(url, { headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);
  const data = await res.json();
  return data.query?.pages || [];
}

const pickBest = (pages, keywords) =>
  pages
    .map(toPhoto)
    .map((p) => ({ p, s: scorePhoto(p, keywords) }))
    .filter(({ s }) => Number.isFinite(s))
    .sort((a, b) => b.s - a.s)[0]?.p || null;

/** Отримує фото для однієї локації: конкретні файли → категорія → пошук */
export async function findPhoto(spec = {}, fetchImpl = fetch) {
  const keywords = spec.keywords || [];

  if (spec.files?.length) {
    const pages = await api({ titles: spec.files.join('|') }, fetchImpl);
    // перший доступний файл у порядку, заданому в даних
    const norm = (t) => t.replace(/_/g, ' ').toLowerCase();
    for (const title of spec.files) {
      const page = pages.find((p) => norm(p.title) === norm(title));
      const photo = toPhoto(page);
      if (photo && photo.width >= 800) return photo;
    }
  }

  if (spec.category) {
    const pages = await api(
      { generator: 'categorymembers', gcmtitle: spec.category, gcmtype: 'file', gcmlimit: '50' },
      fetchImpl
    );
    const photo = pickBest(pages, keywords);
    if (photo) return photo;
  }

  if (spec.search) {
    const pages = await api(
      { generator: 'search', gsrsearch: `${spec.search} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '20' },
      fetchImpl
    );
    const photo = pickBest(pages, keywords);
    if (photo) return photo;
  }

  return null;
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Фото для всіх локацій. Повертає словник { назва локації: photo | null }.
 * Мережеві помилки не зупиняють seed — локації просто залишаються без фото.
 */
export async function loadPhotos(locations, { fetchImpl = fetch, refresh = false, log = console.log } = {}) {
  const cache = refresh ? {} : readCache();
  const result = {};
  let fetched = 0;
  let failed = 0;

  for (const loc of locations) {
    if (cache[loc.name] !== undefined) {
      result[loc.name] = cache[loc.name];
      continue;
    }
    try {
      result[loc.name] = await findPhoto(loc.photo, fetchImpl);
      fetched++;
      await new Promise((r) => setTimeout(r, 150)); // ввічлива пауза між запитами до API
    } catch (err) {
      failed++;
      log(`  ! ${loc.name}: ${err.message}`);
    }
  }

  const merged = { ...cache, ...result };
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(merged, null, 2));
  } catch {
    /* кеш не обов'язковий */
  }

  const found = Object.values(result).filter(Boolean).length;
  log(`Фото: знайдено ${found} з ${locations.length} (нових запитів: ${fetched}, помилок: ${failed})`);
  return result;
}
