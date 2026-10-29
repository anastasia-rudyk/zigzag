import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema(
  { name: String, lat: Number, lng: Number },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    start: { type: pointSchema, required: true },
    days: { type: Number, required: true, min: 1 },
    people: { type: Number, default: 1, min: 1 },
    transport: { type: String, enum: ['car', 'bus'], default: 'car' },
    roundTrip: { type: Boolean, default: false },
    // Порядок у масиві = порядок відвідування після оптимізації
    points: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    distanceKm: Number,
    durationMin: Number,
    nnDistanceKm: Number,
    legsKm: [Number],
    budget: {
      transport: Number,
      lodging: Number,
      tickets: Number,
      food: Number,
      total: Number,
    },
    plan: [
      {
        _id: false,
        day: Number,
        points: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
        minutes: Number,
      },
    ],
    geometry: { type: [[Number]], default: undefined }, // [[lat, lng], ...]
    source: { type: String, enum: ['osrm', 'haversine'] },
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1, createdAt: -1 });

export const Trip = mongoose.model('Trip', tripSchema);
