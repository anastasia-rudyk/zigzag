import { Router } from 'express';
import { Category } from '../models/Category.js';
import { Location } from '../models/Location.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await Category.find().sort({ name: 1 }));
  })
);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, slug, icon } = req.body || {};
    res.status(201).json(await Category.create({ name, slug, icon }));
  })
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, slug, icon } = req.body || {};
    const cat = await Category.findByIdAndUpdate(req.params.id, { name, slug, icon }, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ message: 'Категорію не знайдено' });
    res.json(cat);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const used = await Location.countDocuments({ categoryId: req.params.id });
    if (used > 0) {
      return res.status(409).json({ message: `Категорія використовується в ${used} локаціях` });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).end();
  })
);

export default router;
