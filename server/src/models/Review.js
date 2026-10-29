import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  { timestamps: true }
);

// Один відгук від користувача на локацію: повторне надсилання оновлює наявний
reviewSchema.index({ locationId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ locationId: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
