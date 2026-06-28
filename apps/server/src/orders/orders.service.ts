import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../db';
import { orders, orderItems, appSettings, products, users } from '../db/schema';
import { eq, and, inArray, desc, gte } from 'drizzle-orm';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

async function orderIdExists(orderNumber: string): Promise<boolean> {
  const existing = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    columns: {
      id: true,
    },
  });

  return !!existing;
}

@Injectable()
export class OrdersService {
  async createOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
    shippingDetails?: {
      shippingName?: string;
      shippingAddress?: string;
      shippingState?: string;
      shippingPhone?: string;
    },
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const productIds = items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (dbProducts.length !== productIds.length) {
      throw new BadRequestException('One or more products are invalid');
    }

    // Secure backend price calculation
    let totalAmount = 0;
    const finalItems = items.map((item) => {
      const p = dbProducts.find((prod) => prod.id === item.productId);
      if (!p) throw new BadRequestException('Product not found');
      if (p.stock < item.quantity) {
        throw new NotFoundException(`Insufficient stock for "${p.name}".`);
      }
      let price = parseFloat(p.price);
      if (p.discount && parseFloat(p.discount) > 0) {
        price = price - parseFloat(p.discount);
        price = Math.max(price, 0);
      }
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: price.toString(),
      };
    });

    // Check min order value
    const minOrderSetting = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.settingKey, 'MIN_ORDER_PRICE'))
      .limit(1);
    const minOrderPrice = minOrderSetting[0]?.settingValue
      ? parseFloat(minOrderSetting[0].settingValue)
      : 0;

    if (totalAmount < minOrderPrice) {
      throw new BadRequestException(
        `Minimum order amount is ₹${minOrderPrice}`,
      );
    }
    let orderNumber: string;

    do {
      orderNumber =
        'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    } while (await orderIdExists(orderNumber));
    // Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: orderNumber,
    });

    if (shippingDetails) {
      await db
        .update(users)
        .set({
          name: shippingDetails.shippingName,
          address: shippingDetails.shippingAddress,
          state: shippingDetails.shippingState,
          phone: shippingDetails.shippingPhone,
        })
        .where(eq(users.id, userId));
    }

    const dbOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        totalAmount: totalAmount.toString(),
        status: 'ACKNOWLEDGED',
        paymentId: rpOrder.id,
        shippingName: shippingDetails?.shippingName,
        shippingAddress: shippingDetails?.shippingAddress,
        shippingState: shippingDetails?.shippingState,
        shippingPhone: shippingDetails?.shippingPhone,
      })
      .returning();

    for (const item of finalItems) {
      await db.insert(orderItems).values({
        orderId: dbOrder[0].id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return {
      ...dbOrder[0],
      razorpayOrderId: rpOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<{ valid: boolean; orderNumber?: string }> {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret)
      throw new BadRequestException('Payment gateway not configured');

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(razorpaySignature, 'hex'),
      );
    } catch (err) {
      return { valid: false };
    }

    if (!isValid) return { valid: false };

    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentId, razorpayOrderId))
      .limit(1);
    if (!existingOrder.length) return { valid: false };
    if (existingOrder[0].status === 'PAID')
      return { valid: true, orderNumber: existingOrder[0].orderNumber };

    const orderResult = await db
      .update(orders)
      .set({ status: 'PAID', paymentId: razorpayPaymentId })
      .where(eq(orders.paymentId, razorpayOrderId))
      .returning();

    return { valid: true, orderNumber: orderResult[0]?.orderNumber };
  }

  async trackOrder(orderNumber: string, userId?: string) {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (!order.length) {
      throw new NotFoundException('Order not found');
    }

    // Access control: if user does not own the order, only return status
    // A full system might also check if user has ADMIN role.
    if (!userId || order[0].userId !== userId) {
      return {
        orderNumber: order[0].orderNumber,
        status: order[0].status,
        message: 'Detailed tracking is only available to the order owner.',
      };
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order[0].id));
    return { ...order[0], items };
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = [
      'ACKNOWLEDGED',
      'PAID',
      'DISPATCHED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Allowed statuses: ${validStatuses.join(', ')}`,
      );
    }

    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    if (!result.length) throw new NotFoundException('Order not found');
    return result[0];
  }

  async findAll(statusFilter?: string, dateFilter?: string) {
    let query: any = db.select().from(orders).orderBy(desc(orders.createdAt));

    // Client-side filtering logic could also be done here, but Drizzle where is better.
    // For simplicity, we will fetch and filter in memory if complex, or just use basic where clauses.
    const allOrders = await query;

    // Fetch items for all orders
    const orderIds = allOrders.map((o: any) => o.id);
    let allItems: any[] = [];
    if (orderIds.length > 0) {
      allItems = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          productName: products.name,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(inArray(orderItems.orderId, orderIds));
    }

    const filtered = allOrders.filter((o: any) => {
      let pass = true;
      if (statusFilter === 'NOT_COMPLETED') {
        pass = pass && !['DELIVERED', 'CANCELLED'].includes(o.status);
      }
      if (statusFilter === 'NOT_DELIVERED') {
        pass = pass && o.status !== 'DELIVERED';
      }
      if (statusFilter === 'PAYMENT_NOT_CONFIRMED') {
        pass = pass && o.status === 'ACKNOWLEDGED';
      }
      if (dateFilter === 'TODAY') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        pass = pass && new Date(o.createdAt) >= today;
      }
      return pass;
    });

    return filtered.map((order: any) => ({
      ...order,
      items: allItems.filter((item) => item.orderId === order.id),
    }));
  }

  async findByUserId(userId: string) {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
}
