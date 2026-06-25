"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSettings = exports.discounts = exports.orderItems = exports.orders = exports.products = exports.users = exports.ecomSchema = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.ecomSchema = (0, pg_core_1.pgSchema)('ecom');
exports.users = exports.ecomSchema.table('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    passwordHash: (0, pg_core_1.text)('password_hash'),
    googleId: (0, pg_core_1.text)('google_id'),
    role: (0, pg_core_1.text)('role').notNull().default('USER'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.products = exports.ecomSchema.table('products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    stock: (0, pg_core_1.integer)('stock').notNull().default(0),
    images: (0, pg_core_1.jsonb)('images').notNull().default([]),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.orders = exports.ecomSchema.table('orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id')
        .references(() => exports.users.id)
        .notNull(),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('ACKNOWLEDGED'),
    paymentId: (0, pg_core_1.text)('payment_id'),
    trackingId: (0, pg_core_1.text)('tracking_id'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.orderItems = exports.ecomSchema.table('order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id')
        .references(() => exports.orders.id)
        .notNull(),
    productId: (0, pg_core_1.integer)('product_id')
        .references(() => exports.products.id)
        .notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
});
exports.discounts = exports.ecomSchema.table('discounts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    code: (0, pg_core_1.text)('code').notNull().unique(),
    discountType: (0, pg_core_1.text)('discount_type').notNull(),
    value: (0, pg_core_1.decimal)('value', { precision: 10, scale: 2 }).notNull(),
    minCartValue: (0, pg_core_1.decimal)('min_cart_value', { precision: 10, scale: 2 }).default('0'),
    active: (0, pg_core_1.boolean)('active').default(true),
});
exports.appSettings = exports.ecomSchema.table('app_settings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    settingKey: (0, pg_core_1.text)('setting_key').notNull().unique(),
    settingValue: (0, pg_core_1.text)('setting_value').notNull(),
});
//# sourceMappingURL=schema.js.map