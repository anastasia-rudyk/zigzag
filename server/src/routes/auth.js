import { Router } from 'express';
import { User } from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Заповніть ім'я, email і пароль" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль має містити щонайменше 6 символів' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Користувач із таким email уже існує' });

    const user = await User.create({ name, email, passwordHash: await User.hashPassword(password) });
    res.status(201).json({ token: signToken(user), user });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    const user = email ? await User.findOne({ email: email.toLowerCase() }) : null;
    if (!user || !(await user.checkPassword(password || ''))) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }
    res.json({ token: signToken(user), user });
  })
);

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

// POST /api/auth/favorites/:locationId — додати або прибрати з обраного
router.post(
  '/favorites/:locationId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.locationId;
    const has = req.user.favorites.some((f) => String(f) === id);
    req.user.favorites = has
      ? req.user.favorites.filter((f) => String(f) !== id)
      : [...req.user.favorites, id];
    await req.user.save();
    res.json({ favorites: req.user.favorites });
  })
);

export default router;
