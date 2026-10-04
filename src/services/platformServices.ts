import { PaymentRecord, Dispute, VerificationItem, NotificationItem, ApiResponse } from '../types';
import { MOCK_PAYMENTS, MOCK_DISPUTES, MOCK_VERIFICATIONS, MOCK_NOTIFICATIONS } from '../data/mockDisputes';
import { apiClient } from './api/apiClient';

export const paymentService = {
  async getPaymentHistory(): Promise<ApiResponse<PaymentRecord[]>> {
    try {
      const res = await apiClient.get<PaymentRecord[]>('/payments');
      if (res.success && res.data) return res;
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'Payments fetched',
      data: MOCK_PAYMENTS,
    };
  },
};

export const disputeService = {
  async getDisputes(): Promise<ApiResponse<Dispute[]>> {
    try {
      const res = await apiClient.get<Dispute[]>('/disputes');
      if (res.success && res.data) return res;
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'Disputes retrieved',
      data: MOCK_DISPUTES,
    };
  },

  async createDispute(data: Partial<Dispute>): Promise<ApiResponse<Dispute>> {
    const newDispute: Dispute = {
      id: `DISP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: data.bookingId || 'BK-2026-9204',
      listingTitle: data.listingTitle || 'Rental Asset',
      customerId: data.customerId || 'usr_cust_01',
      customerName: data.customerName || 'Aarav Sharma',
      providerId: data.providerId || 'usr_prov_01',
      providerName: data.providerName || 'Asset Provider',
      disputeType: data.disputeType || 'OTHER',
      subject: data.subject || 'Inquiry',
      description: data.description || '',
      evidenceUrls: data.evidenceUrls || [],
      status: 'SUBMITTED',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      timeline: [
        {
          title: 'Dispute Submitted',
          timestamp: 'Just now',
          by: 'Customer',
          description: data.description || 'Dispute registered with platform mediation.',
        },
      ],
    };

    MOCK_DISPUTES.unshift(newDispute);

    return {
      success: true,
      message: 'Dispute submitted. RentEase Trust & Resolution Desk will review within 24 hours.',
      data: newDispute,
    };
  },
};

export const verificationService = {
  async getVerifications(): Promise<ApiResponse<VerificationItem[]>> {
    return {
      success: true,
      message: 'Verifications retrieved',
      data: MOCK_VERIFICATIONS,
    };
  },

  async updateVerification(id: string, status: VerificationItem['status']): Promise<ApiResponse<VerificationItem | null>> {
    const item = MOCK_VERIFICATIONS.find((v) => v.id === id);
    if (item) {
      item.status = status;
      item.lastUpdated = 'Just now';
      return {
        success: true,
        message: 'Status updated',
        data: item,
      };
    }
    return { success: false, message: 'Not found', data: null };
  },
};

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return {
      success: true,
      message: 'Notifications fetched',
      data: MOCK_NOTIFICATIONS,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (item) item.read = true;
    return { success: true, message: 'Marked read', data: true };
  },

  async markAllAsRead(): Promise<ApiResponse<boolean>> {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
    return { success: true, message: 'All marked read', data: true };
  },
};
