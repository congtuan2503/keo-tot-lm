import Review from '../models/Review.js';

export class ReviewRepository {
  async create(reviewData: any) {
    return Review.create(reviewData);
  }

  async checkExisting(reviewerId: string, matchId: string, targetUserId: string) {
    return Review.findOne({ reviewerId, matchId, targetUserId });
  }

  async findByTargetUser(targetUserId: string) {
    return Review.find({ targetUserId }).populate('reviewerId', 'displayName').sort({ createdAt: -1 });
  }
}
