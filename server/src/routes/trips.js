import { Router } from 'express';
import mongoose from 'mongoose';
import { Location } from '../models/Location.js';
import { Trip } from '../models/Trip.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { buildTrip, validateBuildInput } from '../services/tripBuilder.js';

const router = Router();
router.use(requireAuth);

/** Завантажує локації в тому порядку, у якому прийшли id */
async function loadLocations(ids) {
  if (!ids.every((id) => mongoose.isValidObjectId(id))) return null;
  const docs = await Location.find({ _id: { $in: ids } });
  const byId = new Map(docs.map((d) => [String(d._id), d]));
  const ordered = ids.map((id) => byId.get(String(id)));
  return ordered.every(Boolean) ? ordered : null;
}

// POST /api/trips/build — побудувати маршрут без збереження
router.post(
  '/build',
  asyncHandler(async (req, res) => {
    const errors = validateBuildInput(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join('. '), errors });

    const locations = await loadLocations(req.body.locationIds);
    if (!locations) return res.status(400).json({ message: 'Деякі локації не знайдено' });

    const started = Date.now();
    const result = await buildTrip(req.body, locations);
    res.json({ ...result, computeMs: Date.now() - started });
  })
);

// GET /api/trips — подорожі поточного користувача
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'points', select: 'name region photos categoryId', populate: { path: 'categoryId' } });
    res.json(trips);
  })
);

// GET /api/trips/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
      .populate({ path: 'points', populate: { path: 'categoryId' } })
      .populate('plan.points', 'name region visitMin ticketPrice');
    if (!trip) return res.status(404).json({ message: 'Подорож не знайдено' });
    res.json(trip);
  })
);

// POST /api/trips — зберегти побудований маршрут (сервер перераховує його сам)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const errors = validateBuildInput(req.body);
    if (!req.body?.title?.trim()) errors.push('Вкажіть назву подорожі');
    if (errors.length) return res.status(400).json({ message: errors.join('. '), errors });

    const locations = await loadLocations(req.body.locationIds);
    if (!locations) return res.status(400).json({ message: 'Деякі локації не знайдено' });

    const r = await buildTrip(req.body, locations);
    const trip = await Trip.create({
      userId: req.user._id,
      title: req.body.title.trim(),
      start: req.body.start,
      days: req.body.days,
      people: req.body.people || 1,
      transport: req.body.transport || 'car',
      roundTrip: Boolean(req.body.roundTrip),
      points: r.order,
      distanceKm: r.distanceKm,
      nnDistanceKm: r.nnDistanceKm,
      legsKm: r.legsKm,
      durationMin: r.durationMin,
      budget: r.budget,
      plan: r.plan.map(({ day, points, minutes }) => ({ day, points, minutes })),
      geometry: r.geometry || undefined,
      source: r.source,
    });
    res.status(201).json(trip);
  })
);

// PATCH /api/trips/:id — перейменувати
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const title = req.body?.title?.trim();
    if (!title) return res.status(400).json({ message: 'Вкажіть назву подорожі' });
    const trip = await Trip.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { title }, { new: true });
    if (!trip) return res.status(404).json({ message: 'Подорож не знайдено' });
    res.json(trip);
  })
);

// DELETE /api/trips/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Подорож не знайдено' });
    res.status(204).end();
  })
);

export default router;
