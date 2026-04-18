import { Router } from 'express';
import authRoutes from './auth.routes.js';
import matchRoutes from './match.routes.js';
import userRoutes from './user.routes.js';
import reviewRoutes from './review.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/matches', matchRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);

export default router;
