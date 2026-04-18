import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
  }
};
