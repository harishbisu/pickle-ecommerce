import { OrdersService } from './orders.service';
import { CheckoutDto, VerifyPaymentDto, UpdateOrderStatusDto } from './orders.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, body: CheckoutDto): Promise<{
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
    verifyPayment(body: VerifyPaymentDto): Promise<{
        success: boolean;
        orderId: number | undefined;
    }>;
    track(id: string, req: any): Promise<{
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
    updateStatus(id: string, body: UpdateOrderStatusDto): Promise<{
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
    getUserOrders(req: any): Promise<{
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
