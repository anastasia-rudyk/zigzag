import { Router } from 'express';
import { Location } from '../models/Location.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

const FIELDS = ['name', 'description', 'region', 'categoryId', 'lat', 'lng', 'visitMin', 'ticketPrice', 'photos'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => body?.[k] !== undefined).map((k) => [k, body[k]]));
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/locations?q=&region=&category=&maxPrice=&sort=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { q, region, category, maxPrice, sort } = req.query;
    const filter = {};

    if (q) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ name: rx }, { description: rx }];
    }
    if (region) filter.region = region;
    if (category) filter.categoryId = category;
    if (maxPrice !== undefined && maxPrice !== '') filter.ticketPrice = { $lte: Number(maxPrice) };

    const sortBy = { name: { name: 1 }, price: { ticketPrice: 1 }, region: { region: 1, name: 1 } }[sort] || { name: 1 };
    const items = await Location.find(filter).populate('categoryId').sort(sortBy);
    res.json(items);
  })
);

// GET /api/locations/regions — список областей для фільтра
router.get(
  '/regions',
  asyncHandler(async (_req, res) => {
    const regions = await Location.distinct('region');
    res.json(regions.sort((a, b) => a.localeCompare(b, 'uk')));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await Location.findById(req.params.id).populate('categoryId');
    if (!item) return res.status(404).json({ message: 'Локацію не знайдено' });
    res.json(item);
  })
);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Location.create(pick(req.body));
    res.status(201).json(await item.populate('categoryId'));
  })
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Location.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    }).populate('categoryId');
    if (!item) return res.status(404).json({ message: 'Локацію не знайдено' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Location.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Локацію не знайдено' });
    res.status(204).end();
  })
);

export default router;
