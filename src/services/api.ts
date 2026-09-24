/**
 * PataFundi Service Layer
 * Designed for easy seamless transition from mock data to FastAPI backend endpoints.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { MOCK_CATEGORIES, MOCK_FUNDIS, INITIAL_BOOKINGS } from '../data/mockData';
import { Category, Fundi, FilterOptions, Booking, User, OwnerSummary, EarningsLog, ChatMessage, TrackingInfo } from '../types';

const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000/api/v1`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK = false; // Set to false to prioritize live FastAPI backend

export const ApiService = {
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      return MOCK_CATEGORIES;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unavailable, falling back to mock categories:', e);
      return MOCK_CATEGORIES;
    }
  },

  async getFundis(filters?: FilterOptions): Promise<Fundi[]> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 300));
      let result = [...MOCK_FUNDIS];

      if (filters?.categoryId && filters.categoryId !== 'all') {
        result = result.filter((f) => f.categoryId === filters.categoryId);
      }

      if (filters?.minRating) {
        result = result.filter((f) => f.rating >= (filters.minRating || 0));
      }

      if (filters?.maxDistance) {
        result = result.filter((f) => f.distanceKm <= (filters.maxDistance || 99));
      }

      if (filters?.maxPrice) {
        result = result.filter((f) => f.estimatedPrice <= (filters.maxPrice || 99999));
      }

      if (filters?.sortBy) {
        if (filters.sortBy === 'rating') {
          result.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'distance') {
          result.sort((a, b) => a.distanceKm - b.distanceKm);
        } else if (filters.sortBy === 'price_low') {
          result.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
        } else if (filters.sortBy === 'price_high') {
          result.sort((a, b) => b.estimatedPrice - a.estimatedPrice);
        }
      }

      return result;
    }

    try {
      const cleanFilters: Record<string, string> = {};
      if (filters?.categoryId) cleanFilters.category_id = filters.categoryId;
      if (filters?.minRating) cleanFilters.min_rating = filters.minRating.toString();
      if (filters?.maxDistance) cleanFilters.max_distance = filters.maxDistance.toString();
      if (filters?.maxPrice) cleanFilters.max_price = filters.maxPrice.toString();
      if (filters?.sortBy) cleanFilters.sort_by = filters.sortBy;

      const queryParams = new URLSearchParams(cleanFilters).toString();
      const url = queryParams ? `${API_BASE_URL}/fundis?${queryParams}` : `${API_BASE_URL}/fundis`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unavailable, falling back to mock fundis:', e);
      return MOCK_FUNDIS;
    }
  },

  async getFundiById(id: string): Promise<Fundi | undefined> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      return MOCK_FUNDIS.find((f) => f.id === id);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/fundis/${id}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn(`Backend API unavailable, falling back for fundi ${id}:`, e);
      return MOCK_FUNDIS.find((f) => f.id === id);
    }
  },

  async getBookings(): Promise<Booking[]> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      return INITIAL_BOOKINGS;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unavailable, falling back to mock bookings:', e);
      return INITIAL_BOOKINGS;
    }
  },

  async createBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> {
    if (USE_MOCK) {
      const newBooking: Booking = {
        ...booking,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        commissionRate: 15,
        commissionAmount: Math.round(booking.amount * 0.15),
        fundiEarnings: Math.round(booking.amount * 0.85),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return newBooking;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      return await res.json();
    } catch (e) {
      console.warn('Backend API error on booking creation, using fallback:', e);
      return {
        ...booking,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        commissionRate: 15,
        commissionAmount: Math.round(booking.amount * 0.15),
        fundiEarnings: Math.round(booking.amount * 0.85),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update booking status');
      return await res.json();
    } catch (e) {
      console.warn(`Backend API unavailable for updating status of ${bookingId}:`, e);
      return null;
    }
  },

  async getOwnerSummary(): Promise<OwnerSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/owner/summary`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unavailable for owner summary, using fallback:', e);
      return {
        totalGrossVolume: 6500,
        totalOwnerCommission: 975,
        totalFundiPayouts: 5525,
        completedBookingsCount: 1,
        activeFundisCount: 5,
        commissionRatePercent: 15.0,
      };
    }
  },

  async updateCommissionRate(ratePercent: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/owner/commission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_percent: ratePercent }),
      });
      return res.ok;
    } catch (e) {
      console.warn('Failed to update commission rate:', e);
      return false;
    }
  },

  async getEarningsLog(): Promise<EarningsLog[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/owner/earnings-log`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch earnings log:', e);
      return [
        {
          bookingId: 'BK-9021',
          fundiName: 'John Mboya',
          category: 'Plumbing',
          date: '2026-08-10',
          amount: 2500,
          commissionRate: 15.0,
          commissionAmount: 375,
          fundiEarnings: 2125,
          status: 'confirmed',
        },
        {
          bookingId: 'BK-8419',
          fundiName: 'Joseph Otieno',
          category: 'Cleaning',
          date: '2026-08-02',
          amount: 4000,
          commissionRate: 15.0,
          commissionAmount: 600,
          fundiEarnings: 3400,
          status: 'completed',
        },
      ];
    }
  },

  async getChatMessages(fundiId: string, bookingId?: string): Promise<ChatMessage[]> {
    try {
      const url = bookingId
        ? `${API_BASE_URL}/chat/${fundiId}?booking_id=${bookingId}`
        : `${API_BASE_URL}/chat/${fundiId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch chat messages, using fallback:', e);
      return [
        {
          id: 'MSG-1',
          fundiId,
          bookingId,
          senderId: fundiId,
          senderRole: 'fundi',
          senderName: 'Fundi Specialist',
          receiverId: 'user_1',
          text: 'Jambo! I am on my way to your location with all the tools.',
          timestamp: '10:15 AM',
          isRead: true,
        },
      ];
    }
  },

  async sendChatMessage(msg: {
    bookingId?: string;
    fundiId: string;
    senderId: string;
    senderRole: 'client' | 'fundi';
    senderName: string;
    receiverId: string;
    text: string;
  }): Promise<ChatMessage> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Failed to send message via backend API, using local fallback:', e);
      return {
        ...msg,
        id: `MSG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };
    }
  },

  async getBookingTracking(bookingId: string): Promise<TrackingInfo> {
    try {
      const res = await fetch(`${API_BASE_URL}/tracking/${bookingId}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch tracking info, using fallback:', e);
      return {
        id: bookingId,
        bookingId: bookingId,
        fundiId: 'fundi_1',
        fundiName: 'John Mboya',
        fundiLat: -1.286389,
        fundiLng: 36.817223,
        clientLat: -1.265000,
        clientLng: 36.805000,
        status: 'en_route',
        etaMinutes: 8,
        distanceKm: 1.8,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async loginUser(email: string, pass: string): Promise<{ access_token: string; user: User } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid login credentials');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Backend login error:', e);
      throw e;
    }
  },

  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    fundiId?: string;
    category?: string;
    categoryId?: string;
    experienceYears?: number;
    hourlyRate?: number;
    estimatedPrice?: number;
    nationalId?: string;
    locationName?: string;
    bio?: string;
    skills?: string[];
  }): Promise<{ access_token: string; user: User } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Backend registration error:', e);
      throw e;
    }
  },
};

