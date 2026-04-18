import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { MatchRepository } from '../repositories/MatchRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const matchRepository = new MatchRepository();
const userRepository = new UserRepository();

router.post('/', requireAuth, asyncHandler(async (req: any, res) => {
  const host = await userRepository.findById(req.user.id);
  if (!host) {
     res.status(404).json({ success: false, message: 'User not found' });
     return;
  }

  const matchData = {
    ...req.body,
    hostId: host._id,
    hostInfo: {
      displayName: host.displayName,
      averageRating: host.averageRating,
      totalReviews: host.totalReviews,
      skillLevel: host.skillLevel
    }
  };

  const match = await matchRepository.create(matchData);
  res.status(201).json({ success: true, match });
}));

router.get('/', asyncHandler(async (req, res) => {
  const matches = await matchRepository.findWithFilters(req.query);
  res.json({ success: true, matches });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const match = await matchRepository.findByIdPopulated(req.params.id);
  if (!match) {
    res.status(404).json({ success: false, message: 'Match not found' });
    return;
  }
  res.json({ success: true, match });
}));

router.post('/:id/join', requireAuth, asyncHandler(async (req: any, res) => {
  const match = await matchRepository.addPlayer(req.params.id, req.user.id);
  res.json({ success: true, match });
}));

router.put('/:id', requireAuth, asyncHandler(async (req: any, res) => {
  const match = await matchRepository.findById(req.params.id);
  if (!match) {
    res.status(404).json({ success: false, message: 'Match not found' });
    return;
  }
  if (match.hostId.toString() !== req.user.id) {
    res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa kèo này' });
    return;
  }
  const updatedMatch = await matchRepository.update(req.params.id, req.body);
  res.json({ success: true, match: updatedMatch });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req: any, res) => {
  const match = await matchRepository.findById(req.params.id);
  if (!match) {
    res.status(404).json({ success: false, message: 'Match not found' });
    return;
  }
  if (match.hostId.toString() !== req.user.id) {
    res.status(403).json({ success: false, message: 'Không có quyền xoá kèo này' });
    return;
  }
  await matchRepository.delete(req.params.id);
  res.json({ success: true, message: 'Đã xoá kèo thành công' });
}));

export default router;
