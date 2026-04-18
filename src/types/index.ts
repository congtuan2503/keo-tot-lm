export interface User {
  id?: string;
  _id?: string;
  displayName: string;
  email: string;
  favoriteSports: string[];
  preferredArea: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  averageRating: number;
  totalReviews: number;
}

export interface Match {
  _id: string;
  hostId: string;
  hostInfo: {
    displayName: string;
    averageRating: number;
    totalReviews: number;
    skillLevel: string;
  };
  sport: string;
  location: string;
  time: string;
  playersNeeded: number;
  joinedPlayers: (string | User)[];
  status: 'Open' | 'Closed' | 'Completed';
  createdAt: string;
}

export interface Review {
  _id?: string;
  reviewerId: User | string;
  targetUserId: string;
  matchId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
