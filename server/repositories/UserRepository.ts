import User from '../models/User.js';

export class UserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(userData: any) {
    return User.create(userData);
  }

  async updateStats(id: string, newRating: number) {
    const user = await User.findById(id);
    if (!user) return null;
    
    // Recursive update of stats as requested by pre-compute pattern
    const totalReviews = user.totalReviews + 1;
    const averageRating = ((user.averageRating * user.totalReviews) + newRating) / totalReviews;
    
    user.totalReviews = totalReviews;
    user.averageRating = averageRating;
    return user.save();
  }

  async updateProfile(id: string, updateData: any) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }
}
