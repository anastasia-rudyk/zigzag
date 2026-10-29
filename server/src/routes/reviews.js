import { Router } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Location } from '../models/Location.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { recalcRating } from '../services/reviewService.js';

const router = Router();

// GET /api/reviews?location=<id> — відгуки про локацію, найновіші першими
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { location } = req.query;
    if (!mongoose.isValidObjectId(location)) return res.status(400).json({ message: 'Вкажіть локацію' });
    const reviews = await Review.find({ locationId: location })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name');
    res.json(reviews);
  })
);

// POST /api/reviews — створити або оновити свій відгук
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { locationId, rating, text = '' } = req.body || {};
    if (!mongoose.isValidObjectId(locationId) || !(await Location.exists({ _id: locationId }))) {
      return res.status(400).json({ message: 'Локацію не знайдено' });
    }
    const value = Number(rating);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Оцінка має бути від 1 до 5' });
    }

    const review = await Review.findOneAndUpdate(
      { locationId, userId: req.user._id },
      { rating: value, text: String(text).slice(0, 1000) },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('userId', 'name');

    const stats = await recalcRating(locationId);
    res.status(201).json({ review, ...stats });
  })
);

// DELETE /api/reviews/:id — видалити свій відгук (адміністратор — будь-який)
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Відгук не знайдено' });
    const isOwner = String(review.userId) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Можна видаляти лише власні відгуки' });
    }
    await review.deleteOne();
    const stats = await recalcRating(review.locationId);
    res.json(stats);
  })
);

export default router;
