import { OrdersService } from './orders.service';
import { CheckoutDto, VerifyPaymentDto, UpdateOrderStatusDto } from './orders.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, body: CheckoutDto): Promise<{
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
        shippingName: string | null;
        shippingAddress: string | null;
        shippingState: string | null;
        shippingPhone: string | null;
    }>;
    verifyPayment(body: VerifyPaymentDto): Promise<{
        success: boolean;
        orderNumber: string | undefined;
    }>;
    trackPublic(orderNumber: string, req: any): Promise<{
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
        shippingName: string | null;
        shippingAddress: string | null;
        shippingState: string | null;
        shippingPhone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        message?: undefined;
    }>;
    updateStatus(id: string, body: UpdateOrderStatusDto): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        shippingName: string | null;
        shippingAddress: string | null;
        shippingState: string | null;
        shippingPhone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAll(status?: string, date?: string, page?: string, limit?: string): Promise<{
        data: {
            items: any[];
            id: string;
            orderNumber: string;
            userId: string;
            totalAmount: string;
            status: string;
            paymentId: string | null;
            trackingId: string | null;
            shippingName: string | null;
            shippingAddress: string | null;
            shippingState: string | null;
            shippingPhone: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
    getUserOrders(req: any): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        totalAmount: string;
        status: string;
        paymentId: string | null;
        trackingId: string | null;
        shippingName: string | null;
        shippingAddress: string | null;
        shippingState: string | null;
        shippingPhone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
}
