export interface Category {
  id: string;
  name: string;
  icon: string; // Ionicons / MaterialCommunityIcons key
  description: string;
  activeCount: number;
  bgGradient?: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface Fundi {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  completedJobs: number;
  hourlyRate: number;
  estimatedPrice: number;
  distanceKm: number;
  locationName: string;
  isVerified: boolean;
  isAvailable: boolean;
  isPopular?: boolean;
  bio: string;
  phone: string;
  whatsapp?: string;
  skills: string[];
  portfolio: PortfolioItem[];
  reviews: Review[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  fundiId: string;
  fundiName: string;
  fundiAvatar: string;
  fundiCategory: string;
  fundiPhone: string;
  date: string;
  timeSlot: string;
  address: string;
  description: string;
  paymentMethod: 'mpesa' | 'card' | 'cash';
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  fundiEarnings?: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'booking' | 'system' | 'promo' | 'alert';
  bookingId?: string;
}

export type UserRole = 'client' | 'fundi' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  role?: UserRole;
  fundiId?: string;
}

export interface OwnerSummary {
  totalGrossVolume: number;
  totalOwnerCommission: number;
  totalFundiPayouts: number;
  completedBookingsCount: number;
  activeFundisCount: number;
  commissionRatePercent: number;
}

export interface EarningsLog {
  bookingId: string;
  fundiName: string;
  category: string;
  date: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  fundiEarnings: number;
  status: string;
}

export interface FilterOptions {
  categoryId?: string;
  maxDistance?: number;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'recommended' | 'rating' | 'distance' | 'price_low' | 'price_high';
}

export interface ChatMessage {
  id: string;
  bookingId?: string;
  fundiId: string;
  senderId: string;
  senderRole: 'client' | 'fundi';
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface TrackingInfo {
  id: string;
  bookingId: string;
  fundiId: string;
  fundiName: string;
  fundiLat: number;
  fundiLng: number;
  clientLat: number;
  clientLng: number;
  status: 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed';
  etaMinutes: number;
  distanceKm: number;
  updatedAt: string;
}


