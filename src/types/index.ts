// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  isBooster: boolean;
  isModerator: boolean;
  balance: number;
  description?: string;
  discord?: string;
  telegram?: string;
}

// Booster types
export interface Booster {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  currentRank: Rank;
  peakRank: Rank;
  winrate: number;
  totalOrders: number;
  completedOrders: number;
  rating: number;
  reviews: Review[];
  pricePerGame: number;
  pricePerMMR: number;
  languages: string[];
  roles: Role[];
  heroes: string[];
  description: string;
  isOnline: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

export type Rank = 
  | 'Herald'
  | 'Guardian'
  | 'Crusader'
  | 'Archon'
  | 'Legend'
  | 'Ancient'
  | 'Divine'
  | 'Immortal';

export type Role = 'Carry' | 'Mid' | 'Offlane' | 'Support' | 'Hard Support';

export interface Review {
  id: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  boosterId: string;
  rating: number;
  comment: string;
  date: Date;
  isVerified: boolean;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  userName: string;
  boosterId?: string;
  boosterName?: string;
  status: OrderStatus;
  type: OrderType;
  currentMMR: number;
  targetMMR: number;
  price: number;
  createdAt: Date;
  completedAt?: Date;
  canReview: boolean;
  isReviewed: boolean;
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type OrderType = 'mmr_boost' | 'calibration' | 'coaching';

// Chat types
export interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

// Filter types
export interface BoosterFilters {
  rank?: Rank;
  role?: Role;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  language?: string;
  isOnline?: boolean;
}
