import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema(
  {
    author: String,
    license: String,
    licenseUrl: String,
    source: String, // сторінка файлу на Wikimedia Commons
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 2000 },
    region: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    lat: { type: Number, required: true, min: 44, max: 53 },
    lng: { type: Number, required: true, min: 22, max: 41 },
    visitMin: { type: Number, default: 60, min: 0, max: 720 },
    ticketPrice: { type: Number, default: 0, min: 0 },
    photos: [{ type: String }],
    photoCredit: { type: creditSchema, default: undefined },
    // Агреговані дані відгуків, перераховуються після кожної зміни (див. services/reviewService.js)
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

locationSchema.index({ region: 1 });
locationSchema.index({ categoryId: 1 });
locationSchema.index({ ratingAvg: -1 });

export const Location = mongoose.model('Location', locationSchema);
