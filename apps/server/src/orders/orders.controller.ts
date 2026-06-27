import {
  Controller, Post, Get, Patch, Body, Param, UseGuards, Request, HttpCode, HttpStatus, BadRequestException, Query
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

  // Allow unauthenticated tracking by orderNumber
  @Get('track/:orderNumber')
  async trackPublic(@Param('orderNumber') orderNumber: string, @Request() req: any) {
    // If user is authenticated, we can optionally pass their user ID
    // but the service will handle public vs authenticated data returns.
    return this.ordersService.trackOrder(orderNumber, req.user?.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(@Query('status') status?: string, @Query('date') date?: string) {
    return this.ordersService.findAll(status, date);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/my-orders')
  async getUserOrders(@Request() req: any) {
    return this.ordersService.findByUserId(req.user.id);
  }
}
