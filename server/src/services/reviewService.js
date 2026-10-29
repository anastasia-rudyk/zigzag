import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Location } from '../models/Location.js';

/** Середня оцінка, округлена до десятих (формула середнього арифметичного) */
export function averageRating(ratings) {
  if (!ratings.length) return { ratingAvg: 0, ratingCount: 0 };
  const sum = ratings.reduce((s, r) => s + r, 0);
  return { ratingAvg: Math.round((sum / ratings.length) * 10) / 10, ratingCount: ratings.length };
}

/** Перераховує рейтинг локації агрегацією MongoDB і зберігає його в документі локації */
export async function recalcRating(locationId) {
  const [agg] = await Review.aggregate([
    { $match: { locationId: new mongoose.Types.ObjectId(String(locationId)) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const stats = agg
    ? { ratingAvg: Math.round(agg.avg * 10) / 10, ratingCount: agg.count }
    : { ratingAvg: 0, ratingCount: 0 };
  await Location.findByIdAndUpdate(locationId, stats);
  return stats;
}
