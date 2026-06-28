import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString({ message: 'Product ID must be a string' })
  productId!: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity!: number;
}

export class CheckoutDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString({ message: 'Shipping name must be a string' })
  shippingName!: string;

  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress!: string;

  @IsString({ message: 'Shipping state must be a string' })
  shippingState!: string;

  @IsString({ message: 'Shipping phone must be a string' })
  shippingPhone!: string;
}

export class VerifyPaymentDto {
  @IsString({ message: 'Razorpay Order ID must be a string' })
  razorpayOrderId!: string;

  @IsString({ message: 'Razorpay Payment ID must be a string' })
  razorpayPaymentId!: string;

  @IsString({ message: 'Razorpay Signature must be a string' })
  razorpaySignature!: string;
}

export class UpdateOrderStatusDto {
  @IsString({ message: 'Status must be a string' })
  status!: string;
}
