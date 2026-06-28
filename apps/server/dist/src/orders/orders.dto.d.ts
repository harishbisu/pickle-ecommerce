export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CheckoutDto {
    items: OrderItemDto[];
    shippingName: string;
    shippingAddress: string;
    shippingState: string;
    shippingPhone: string;
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
}
