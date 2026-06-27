export declare class OrdersService {
    createOrder(userId: string, items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        razorpayOrderId: string;
        razorpayKeyId: string | undefined;
        id: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
    }>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        valid: boolean;
        orderId?: string;
    }>;
    trackOrder(orderNumber: string, userId?: string): Promise<{
        orderNumber: string;
        status: string;
        message: string;
    } | {
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            price: string;
        }[];
        id: string;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        message?: undefined;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAll(statusFilter?: string, dateFilter?: string): Promise<any>;
    findByUserId(userId: string): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
}
