import Match from '../models/Match.js';

export class MatchRepository {
  async create(matchData: any) {
    return Match.create(matchData);
  }

  async findWithFilters(filters: any) {
    const query: any = { status: 'Open' };
    if (filters.sport) query.sport = filters.sport;
    if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
    if (filters.date) {
      const targetDate = new Date(filters.date);
      targetDate.setHours(0,0,0,0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.time = { $gte: targetDate, $lt: nextDate };
    }
    if (filters.playersNeeded) {
      query.playersNeeded = { $gte: parseInt(filters.playersNeeded) };
    }
    if (filters.skillLevel && filters.skillLevel !== 'All') {
      query['hostInfo.skillLevel'] = filters.skillLevel;
    }
    return Match.find(query).sort({ time: 1 });
  }

  async findById(id: string) {
    return Match.findById(id);
  }

  async findByIdPopulated(id: string) {
    return Match.findById(id).populate('joinedPlayers', 'displayName averageRating skillLevel');
  }

  async addPlayer(matchId: string, playerId: string) {
    return Match.findByIdAndUpdate(matchId, { $addToSet: { joinedPlayers: playerId } }, { new: true });
  }

  async update(id: string, updateData: any) {
    return Match.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return Match.findByIdAndDelete(id);
  }
}
