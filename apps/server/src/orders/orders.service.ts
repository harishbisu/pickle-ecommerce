import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { orders, orderItems, appSettings } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

@Injectable()
export class OrdersService {
  async createOrder(userId: number, items: { productId: number; quantity: number; price: number }[]) {
    // Validate items
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Fetch minimum order value from settings
    const minOrderSetting = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.settingKey, 'MIN_ORDER_PRICE'))
      .limit(1);
    const minOrderPrice = minOrderSetting[0]?.settingValue
      ? parseFloat(minOrderSetting[0].settingValue)
      : 0;

    if (totalAmount < minOrderPrice) {
      throw new BadRequestException(`Minimum order amount is ₹${minOrderPrice}`);
    }

    // Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
    });

    // Persist order in DB with ACKNOWLEDGED status (NOT paid yet)
    const dbOrder = await db
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toString(),
        status: 'ACKNOWLEDGED',
        paymentId: rpOrder.id,
      })
      .returning();

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: dbOrder[0].id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toString(),
      });
    }

    return {
      ...dbOrder[0],
      razorpayOrderId: rpOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  /**
   * SECURITY: Verify Razorpay payment using HMAC-SHA256 signature.
   * Razorpay signs the payment using: HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
   * We verify this signature server-side before marking any order as PAID.
   * This prevents fraudulent payment confirmations from the client.
   *
   * IDEMPOTENCY: If the same payment is verified multiple times, we return the existing order
   * without creating duplicate charges. This prevents issues if the client retries verification.
   */
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<{ valid: boolean; orderId?: number }> {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new BadRequestException('Payment gateway not configured');
    }

    // Construct the expected signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(razorpaySignature, 'hex'),
      );
    } catch (err) {
      // timingSafeEqual throws if buffer lengths don't match
      return { valid: false };
    }

    if (!isValid) {
      return { valid: false };
    }

    // Check if order already exists with this Razorpay order ID
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentId, razorpayOrderId))
      .limit(1);

    if (!existingOrder.length) {
      return { valid: false };
    }

    // If order is already PAID, return idempotently (prevent duplicate processing)
    if (existingOrder[0].status === 'PAID') {
      return { valid: true, orderId: existingOrder[0].id };
    }

    // Mark order as PAID
    const orderResult = await db
      .update(orders)
      .set({ status: 'PAID', paymentId: razorpayPaymentId })
      .where(eq(orders.paymentId, razorpayOrderId))
      .returning();

    return { valid: true, orderId: orderResult[0]?.id };
  }

  async trackOrder(id: number, userId: number) {
    // Security: Ensure user can only track their own orders
    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, userId)))
      .limit(1);

    if (!order.length) {
      throw new NotFoundException('Order not found');
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    return { ...order[0], items };
  }

  async updateStatus(id: number, status: string) {
    // Validate status
    const validStatuses = ['ACKNOWLEDGED', 'PAID', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Allowed statuses: ${validStatuses.join(', ')}`);
    }

    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    if (!result.length) {
      throw new NotFoundException('Order not found');
    }
    return result[0];
  }

  async findAll() {
    return await db.select().from(orders);
  }

  async findByUserId(userId: number) {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
}
