import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

class VerifyPaymentDto {
  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkout(@Request() req: any, @Body() body: CheckoutDto) {
    return this.ordersService.createOrder(req.user.id, body.items);
  }

  /**
   * Verify Razorpay payment signature — CRITICAL SECURITY ENDPOINT
   * Only marks order PAID after cryptographic verification
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('verify-payment')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    const result = await this.ordersService.verifyPayment(
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );
    if (!result.valid) {
      throw new BadRequestException('Payment signature verification failed');
    }
    return { success: true, orderId: result.orderId };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('track/:id')
  async track(@Param('id') id: string) {
    return this.ordersService.trackOrder(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }
}
