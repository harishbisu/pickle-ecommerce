export declare class OrdersService {
    createOrder(userId: number, items: {
        productId: number;
        quantity: number;
        price: number;
    }[]): Promise<{
        razorpayOrderId: string;
        razorpayKeyId: string | undefined;
        id: number;
        createdAt: Date | null;
        updatedAt: Date | null;
        userId: number;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
    }>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        valid: boolean;
        orderId?: number;
    }>;
    trackOrder(id: number, userId: number): Promise<{
        items: {
            id: number;
            orderId: number;
            productId: number;
            quantity: number;
            price: string;
        }[];
        id: number;
        userId: number;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        userId: number;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAll(): Promise<{
        id: number;
        userId: number;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
    findByUserId(userId: number): Promise<{
        id: number;
        userId: number;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
}
