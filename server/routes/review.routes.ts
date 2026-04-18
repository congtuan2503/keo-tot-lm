import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { ReviewRepository } from '../repositories/ReviewRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const reviewRepository = new ReviewRepository();
const userRepository = new UserRepository();

router.post('/', requireAuth, asyncHandler(async (req: any, res) => {
  const { matchId, targetUserId, rating, comment } = req.body;

  if (req.user.id === targetUserId) {
    res.status(400).json({ success: false, message: 'Bạn không thể tự đánh giá chính mình' });
    return;
  }

  const existingReview = await reviewRepository.checkExisting(req.user.id, matchId, targetUserId);
  if (existingReview) {
    res.status(400).json({ success: false, message: 'Bạn đã đánh giá người dùng này trong trận đấu này rồi' });
    return;
  }

  const review = await reviewRepository.create({
    reviewerId: req.user.id,
    targetUserId,
    matchId,
    rating,
    comment
  });

  // Pre-Compute update total and avg
  await userRepository.updateStats(targetUserId, rating);

  res.status(201).json({ success: true, review });
}));

router.get('/target/:userId', asyncHandler(async (req, res) => {
  const reviews = await reviewRepository.findByTargetUser(req.params.userId);
  res.json({ success: true, reviews });
}));

export default router;
