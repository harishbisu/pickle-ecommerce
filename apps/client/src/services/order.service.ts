import { apiClient } from './api-client';
import { Order, CartItem } from '../types';

export const orderService = {
    checkout: (items: CartItem[]) =>
        apiClient.post<{ id: string; razorpayOrderId: string; razorpayKeyId: string; totalAmount: string }>(
            '/orders/checkout',
            { items },
        ),

    verifyPayment: (data: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }) => apiClient.post<{ success: boolean; orderId: string }>('/orders/verify-payment', data),

    track: (id: string) => apiClient.get<Order>(`/orders/track/${id}`),

    list: () => apiClient.get<Order[]>('/orders'),

    updateStatus: (id: string, status: string) =>
        apiClient.patch<Order>(`/orders/${id}/status`, { status }),
};
