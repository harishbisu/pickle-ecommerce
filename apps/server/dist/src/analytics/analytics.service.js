"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let AnalyticsService = class AnalyticsService {
    async getDashboardMetrics() {
        const totalUsersResult = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.users);
        const totalOrdersResult = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.orders);
        const totalRevenueResult = await db_1.db.select({
            total: (0, drizzle_orm_1.sql) `sum(CAST(${schema_1.orders.totalAmount} AS DECIMAL))`
        }).from(schema_1.orders).where((0, drizzle_orm_1.sql) `${schema_1.orders.status} != 'CANCELLED'`);
        return {
            totalUsers: totalUsersResult[0].count,
            totalOrders: totalOrdersResult[0].count,
            totalRevenue: totalRevenueResult[0].total || 0,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map