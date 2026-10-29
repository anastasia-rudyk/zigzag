import mongoose from 'mongoose';

/** Обгортка для async-обробників, щоб помилки потрапляли в errorHandler */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function notFound(req, res) {
  res.status(404).json({ message: `Маршрут ${req.originalUrl} не знайдено` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join('; ') });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Некоректний ідентифікатор' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Такий запис уже існує' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Внутрішня помилка сервера' });
}
