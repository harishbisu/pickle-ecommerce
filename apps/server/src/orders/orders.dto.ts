import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @IsNumber({}, { message: 'Price must be a number' })
  price: number;
}

export class CheckoutDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class VerifyPaymentDto {
  @IsString({ message: 'Razorpay Order ID must be a string' })
  razorpayOrderId: string;

  @IsString({ message: 'Razorpay Payment ID must be a string' })
  razorpayPaymentId: string;

  @IsString({ message: 'Razorpay Signature must be a string' })
  razorpaySignature: string;
}

export class UpdateOrderStatusDto {
  @IsString({ message: 'Status must be a string' })
  status: string;
}
