import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  hostId: mongoose.Types.ObjectId;
  hostInfo: {
    displayName: string;
    averageRating: number;
    totalReviews: number;
    skillLevel: string;
  };
  sport: string;
  location: string;
  time: Date;
  playersNeeded: number;
  joinedPlayers: mongoose.Types.ObjectId[];
  status: 'Open' | 'Closed' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostInfo: {
    displayName: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    skillLevel: { type: String, default: 'Beginner' }
  },
  sport: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: Date, required: true },
  playersNeeded: { type: Number, required: true, min: 1 },
  joinedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Open', 'Closed', 'Completed'], default: 'Open' }
}, {
  timestamps: true
});

MatchSchema.index({ sport: 1, location: 1, time: 1 });

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
