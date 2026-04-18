import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  displayName: string;
  email: string;
  passwordHash: string;
  favoriteSports: string[];
  preferredArea: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  favoriteSports: [{ type: String }],
  preferredArea: { type: String },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
