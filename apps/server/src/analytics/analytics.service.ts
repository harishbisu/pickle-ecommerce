import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { users, orders } from '../db/schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class AnalyticsService {
  async getDashboardMetrics() {
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    // Calculate total revenue
    const totalRevenueResult = await db
      .select({
        total: sql<number>`sum(CAST(${orders.totalAmount} AS DECIMAL))`,
      })
      .from(orders)
      .where(
        sql`${orders.status} != 'CANCELLED' and ${orders.status} != 'ACKNOWLEGED'`,
      );

    return {
      totalUsers: totalUsersResult[0].count,
      totalOrders: totalOrdersResult[0].count,
      totalRevenue: totalRevenueResult[0].total || 0,
    };
  }
}
