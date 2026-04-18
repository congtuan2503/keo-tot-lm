import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';

const userRepository = new UserRepository();

export class AuthService {
  async register(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      displayName: data.displayName,
      email: data.email,
      passwordHash,
      favoriteSports: data.favoriteSports || [],
      preferredArea: data.preferredArea || '',
      skillLevel: data.skillLevel || 'Beginner'
    });

    return this.generateToken(user.id);
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    return { token: this.generateToken(user.id), user: { id: user.id, displayName: user.displayName, email: user.email } };
  }

  private generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
  }
}
