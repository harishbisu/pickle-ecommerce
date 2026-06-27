import {
  Controller, Post, Get, Patch, Body, Param, UseGuards, Request, HttpCode, HttpStatus, BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CheckoutDto, VerifyPaymentDto, UpdateOrderStatusDto } from './orders.dto';

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
  async track(@Param('id') id: string, @Request() req: any) {
    // Security: Users can only track their own orders
    return this.ordersService.trackOrder(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(+id, body.status);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/my-orders')
  async getUserOrders(@Request() req: any) {
    // Security: Users can only view their own orders
    return this.ordersService.findByUserId(req.user.id);
  }
}
