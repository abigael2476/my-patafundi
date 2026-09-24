import React, { createContext, useContext, useState } from 'react';
import { Booking, Notification, Fundi } from '../types';
import { MOCK_FUNDIS, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  fundis: Fundi[];
  savedFundiIds: string[];
  toggleSaveFundi: (id: string) => void;
  isSaved: (id: string) => boolean;
  bookings: Booking[];
  addBooking: (newBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fundis] = useState<Fundi[]>(MOCK_FUNDIS);
  const [savedFundiIds, setSavedFundiIds] = useState<string[]>(['f1', 'f3']);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const toggleSaveFundi = (id: string) => {
    setSavedFundiIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedFundiIds.includes(id);

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    const createdBooking: Booking = {
      ...newBookingData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [createdBooking, ...prev]);

    // Also inject a notification
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      title: 'Booking Confirmed! 🎉',
      message: `Your booking for ${createdBooking.fundiName} (${createdBooking.fundiCategory}) on ${createdBooking.date} has been confirmed.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'booking',
      bookingId: createdBooking.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return createdBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        fundis,
        savedFundiIds,
        toggleSaveFundi,
        isSaved,
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        notifications,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
