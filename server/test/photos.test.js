import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPhoto, scorePhoto, findPhoto } from '../src/seed/photos.js';
import { averageRating } from '../src/services/reviewService.js';
import { locations, categories } from '../src/seed/data.js';

const page = (title, { width = 4000, height = 2667, license = 'CC BY-SA 4.0', mime = 'image/jpeg', artist = '<a href="#">Ivan Petrenko</a>' } = {}) => ({
  title,
  imageinfo: [
    {
      thumburl: `https://upload.wikimedia.org/thumb/${encodeURIComponent(title)}/1280px.jpg`,
      url: 'https://upload.wikimedia.org/original.jpg',
      descriptionurl: `https://commons.wikimedia.org/wiki/${title}`,
      width,
      height,
      mime,
      extmetadata: { Artist: { value: artist }, LicenseShortName: { value: license }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' } },
    },
  ],
});

// Імітація fetch: повертає задані сторінки залежно від типу запиту
const fakeFetch = (handlers) => async (url) => {
  const params = new URL(url).searchParams;
  const key = params.get('titles') ? 'titles' : params.get('generator');
  return { ok: true, json: async () => ({ query: { pages: handlers[key]?.(params) || [] } }) };
};

test('toPhoto очищує HTML з імені автора та бере ліцензію', () => {
  const p = toPhoto(page('File:Hoverla view.jpg'));
  assert.equal(p.credit.author, 'Ivan Petrenko');
  assert.equal(p.credit.license, 'CC BY-SA 4.0');
  assert.match(p.url, /1280px/);
});

test('toPhoto відкидає невільні ліцензії та не-зображення', () => {
  assert.equal(toPhoto(page('File:A.jpg', { license: 'All rights reserved' })), null);
  assert.equal(toPhoto(page('File:A.pdf', { mime: 'application/pdf' })), null);
  assert.equal(toPhoto({ title: 'File:Missing.jpg', missing: true }), null);
});

test('scorePhoto віддає перевагу горизонтальним фото з ключовим словом у назві', () => {
  const good = toPhoto(page('File:Hoverla summit.jpg'));
  const other = toPhoto(page('File:Mountains.jpg'));
  const portrait = toPhoto(page('File:Hoverla portrait.jpg', { width: 2000, height: 3000 }));
  const map = toPhoto(page('File:Hoverla map.jpg'));
  assert.ok(scorePhoto(good, ['hoverla']) > scorePhoto(other, ['hoverla']));
  assert.equal(scorePhoto(portrait, ['hoverla']), -Infinity);
  assert.equal(scorePhoto(map, ['hoverla']), -Infinity);
});

test('findPhoto бере перший доступний файл зі списку', async () => {
  const fetchImpl = fakeFetch({ titles: () => [{ title: 'File:First.jpg', missing: true }, page('File:Second.jpg')] });
  const p = await findPhoto({ files: ['File:First.jpg', 'File:Second.jpg'] }, fetchImpl);
  assert.equal(p.title, 'File:Second.jpg');
});

test('findPhoto переходить до категорії, якщо файлів немає', async () => {
  const fetchImpl = fakeFetch({
    titles: () => [],
    categorymembers: () => [page('File:Castle map.jpg'), page('File:Castle view.jpg', { width: 3000, height: 2000 })],
  });
  const p = await findPhoto({ files: ['File:Gone.jpg'], category: 'Category:Castle', keywords: ['castle'] }, fetchImpl);
  assert.equal(p.title, 'File:Castle view.jpg');
});

test('середній рейтинг округлюється до десятих', () => {
  assert.deepEqual(averageRating([5, 4, 4]), { ratingAvg: 4.3, ratingCount: 3 });
  assert.deepEqual(averageRating([]), { ratingAvg: 0, ratingCount: 0 });
});

test('дані: 60 локацій з унікальними назвами, коректними категоріями й координатами в межах України', () => {
  assert.equal(locations.length, 60);
  assert.equal(new Set(locations.map((l) => l.name)).size, 60);
  const slugs = new Set(categories.map((c) => c.slug));
  for (const l of locations) {
    assert.ok(slugs.has(l.category), l.name);
    assert.ok(l.lat > 44 && l.lat < 53 && l.lng > 22 && l.lng < 41, l.name);
    assert.ok(l.photo && (l.photo.files || l.photo.category || l.photo.search), l.name);
  }
});
