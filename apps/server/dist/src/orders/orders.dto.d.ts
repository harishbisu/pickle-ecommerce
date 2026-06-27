export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CheckoutDto {
    items: OrderItemDto[];
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
}
