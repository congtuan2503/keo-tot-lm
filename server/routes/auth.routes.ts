import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../services/AuthService.js';
import { requireAuth } from '../middleware/auth.js';
import { UserRepository } from '../repositories/UserRepository.js';

const router = Router();
const authService = new AuthService();
const userRepository = new UserRepository();

router.post('/register', asyncHandler(async (req, res) => {
  try {
    const token = await authService.register(req.body);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ success: true, token });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

router.post('/login', asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.cookie('token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: result.user, token: result.token });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
}));

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', requireAuth, asyncHandler(async (req: any, res) => {
  const user = await userRepository.findById(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, user: { id: user.id, displayName: user.displayName, email: user.email, favoriteSports: user.favoriteSports, preferredArea: user.preferredArea, skillLevel: user.skillLevel, averageRating: user.averageRating, totalReviews: user.totalReviews } });
}));

export default router;
