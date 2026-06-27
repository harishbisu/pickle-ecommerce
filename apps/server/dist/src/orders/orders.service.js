"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = __importStar(require("crypto"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
let OrdersService = class OrdersService {
    async createOrder(userId, items) {
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const minOrderSetting = await db_1.db
            .select()
            .from(schema_1.appSettings)
            .where((0, drizzle_orm_1.eq)(schema_1.appSettings.settingKey, 'MIN_ORDER_PRICE'))
            .limit(1);
        const minOrderPrice = minOrderSetting[0]?.settingValue
            ? parseFloat(minOrderSetting[0].settingValue)
            : 0;
        if (totalAmount < minOrderPrice) {
            throw new common_1.BadRequestException(`Minimum order amount is ₹${minOrderPrice}`);
        }
        const rpOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
        });
        const dbOrder = await db_1.db
            .insert(schema_1.orders)
            .values({
            userId,
            totalAmount: totalAmount.toString(),
            status: 'ACKNOWLEDGED',
            paymentId: rpOrder.id,
        })
            .returning();
        for (const item of items) {
            await db_1.db.insert(schema_1.orderItems).values({
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
    async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            throw new common_1.BadRequestException('Payment gateway not configured');
        }
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');
        let isValid = false;
        try {
            isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(razorpaySignature, 'hex'));
        }
        catch (err) {
            return { valid: false };
        }
        if (!isValid) {
            return { valid: false };
        }
        const existingOrder = await db_1.db
            .select()
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.eq)(schema_1.orders.paymentId, razorpayOrderId))
            .limit(1);
        if (!existingOrder.length) {
            return { valid: false };
        }
        if (existingOrder[0].status === 'PAID') {
            return { valid: true, orderId: existingOrder[0].id };
        }
        const orderResult = await db_1.db
            .update(schema_1.orders)
            .set({ status: 'PAID', paymentId: razorpayPaymentId })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.paymentId, razorpayOrderId))
            .returning();
        return { valid: true, orderId: orderResult[0]?.id };
    }
    async trackOrder(id, userId) {
        const order = await db_1.db
            .select()
            .from(schema_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orders.id, id), (0, drizzle_orm_1.eq)(schema_1.orders.userId, userId)))
            .limit(1);
        if (!order.length) {
            throw new common_1.NotFoundException('Order not found');
        }
        const items = await db_1.db.select().from(schema_1.orderItems).where((0, drizzle_orm_1.eq)(schema_1.orderItems.orderId, id));
        return { ...order[0], items };
    }
    async updateStatus(id, status) {
        const validStatuses = ['ACKNOWLEDGED', 'PAID', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Allowed statuses: ${validStatuses.join(', ')}`);
        }
        const result = await db_1.db.update(schema_1.orders).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id)).returning();
        if (!result.length) {
            throw new common_1.NotFoundException('Order not found');
        }
        return result[0];
    }
    async findAll() {
        return await db_1.db.select().from(schema_1.orders);
    }
    async findByUserId(userId) {
        return await db_1.db.select().from(schema_1.orders).where((0, drizzle_orm_1.eq)(schema_1.orders.userId, userId));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)()
], OrdersService);
//# sourceMappingURL=orders.service.js.map