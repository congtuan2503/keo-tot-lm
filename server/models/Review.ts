import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  matchId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

ReviewSchema.index({ targetUserId: 1 });
ReviewSchema.index({ reviewerId: 1, targetUserId: 1, matchId: 1 }, { unique: true }); // Prevent multiple reviews per match by same user

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
