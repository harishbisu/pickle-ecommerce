import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../db';
import { orders, orderItems, appSettings } from '../db/schema';
import { eq } from 'drizzle-orm';
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
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpaySignature, 'hex'),
    );

    if (!isValid) {
      return { valid: false };
    }

    // Find the order by Razorpay order ID and mark as PAID
    const orderResult = await db
      .update(orders)
      .set({ status: 'PAID', paymentId: razorpayPaymentId })
      .where(eq(orders.paymentId, razorpayOrderId))
      .returning();

    return { valid: true, orderId: orderResult[0]?.id };
  }

  async trackOrder(id: number) {
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order.length) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    return { ...order[0], items };
  }

  async updateStatus(id: number, status: string) {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async findAll() {
    return await db.select().from(orders);
  }
}
