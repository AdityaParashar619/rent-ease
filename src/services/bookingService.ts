import { Booking, BookingStatus, ApiResponse } from '../types';
import { OfflineStorage } from './offlineStorage';
import { apiClient } from './api/apiClient';

export const bookingService = {
  async getBookingsForUser(userId?: string): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await apiClient.get<Booking[]>('/bookings', { userId: userId || '' });
      if (response.success && response.data) return response;
    } catch {
      // Offline fallback
    }

    const bookings = OfflineStorage.getCachedBookings();
    return {
      success: true,
      message: 'Bookings retrieved',
      data: bookings,
    };
  },

  async getBookingById(bookingId: string): Promise<ApiResponse<Booking | null>> {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      if (response.success && response.data) return response;
    } catch {
      // Offline fallback
    }

    const bookings = OfflineStorage.getCachedBookings();
    const found = bookings.find((b) => b.id === bookingId) || null;

    return {
      success: !!found,
      message: found ? 'Booking found' : 'Booking not found',
      data: found,
    };
  },

  async createBooking(bookingPayload: Omit<Booking, 'id' | 'createdAt'>): Promise<ApiResponse<Booking>> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    const newBooking: Booking = {
      ...bookingPayload,
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESSFUL',
      transactionId: `TXN-RE-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    if (isOnline) {
      try {
        const response = await apiClient.post<Booking>('/bookings', newBooking);
        if (response.success && response.data) {
          OfflineStorage.addBooking(response.data, false);
          return response;
        }
      } catch {
        // Fallback to offline store
      }
    }

    // Save to offline storage and offline queue if not online
    OfflineStorage.addBooking(newBooking, !isOnline);

    return {
      success: true,
      message: isOnline ? 'Booking confirmed successfully' : 'Saved to offline queue. Will sync when back online.',
      data: newBooking,
    };
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<ApiResponse<Booking | null>> {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}/status`, { status });
      if (response.success && response.data) return response;
    } catch {
      // Fallback
    }

    const bookings = OfflineStorage.getCachedBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = status;
      localStorage.setItem('rentease_cached_bookings', JSON.stringify(bookings));
      return {
        success: true,
        message: `Booking status updated to ${status}`,
        data: booking,
      };
    }

    return {
      success: false,
      message: 'Booking not found',
      data: null,
    };
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<Booking | null>> {
    return this.updateBookingStatus(bookingId, 'CANCELLED');
  },
};
