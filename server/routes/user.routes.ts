import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { UserRepository } from '../repositories/UserRepository.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const userRepository = new UserRepository();

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.params.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    return;
  }
  res.json({ success: true, user: { id: user.id, displayName: user.displayName, favoriteSports: user.favoriteSports, preferredArea: user.preferredArea, skillLevel: user.skillLevel, averageRating: user.averageRating, totalReviews: user.totalReviews } });
}));

router.put('/me', requireAuth, asyncHandler(async (req: any, res) => {
  const user = await userRepository.updateProfile(req.user.id, {
    displayName: req.body.displayName,
    favoriteSports: req.body.favoriteSports,
    preferredArea: req.body.preferredArea,
    skillLevel: req.body.skillLevel
  });
  res.json({ success: true, user });
}));

export default router;
