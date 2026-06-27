"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issues = exports.reviews = exports.appSettings = exports.discounts = exports.orderItems = exports.orders = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    passwordHash: (0, pg_core_1.text)('password_hash'),
    googleId: (0, pg_core_1.text)('google_id'),
    role: (0, pg_core_1.text)('role').notNull().default('USER'),
    address: (0, pg_core_1.text)('address'),
    phone: (0, pg_core_1.text)('phone'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    stock: (0, pg_core_1.integer)('stock').notNull().default(0),
    images: (0, pg_core_1.jsonb)('images').notNull().default([]),
    specifications: (0, pg_core_1.jsonb)('specifications').default({}),
    isFeatured: (0, pg_core_1.boolean)('is_featured').notNull().default(false),
    discount: (0, pg_core_1.decimal)('discount', { precision: 10, scale: 2 }).default('0'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    orderNumber: (0, pg_core_1.text)('order_number').notNull().unique(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => exports.users.id)
        .notNull(),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('ACKNOWLEDGED'),
    paymentId: (0, pg_core_1.text)('payment_id'),
    trackingId: (0, pg_core_1.text)('tracking_id'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.orderItems = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    orderId: (0, pg_core_1.uuid)('order_id')
        .references(() => exports.orders.id)
        .notNull(),
    productId: (0, pg_core_1.uuid)('product_id')
        .references(() => exports.products.id)
        .notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
});
exports.discounts = (0, pg_core_1.pgTable)('discounts', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    code: (0, pg_core_1.text)('code').notNull().unique(),
    discountType: (0, pg_core_1.text)('discount_type').notNull(),
    value: (0, pg_core_1.decimal)('value', { precision: 10, scale: 2 }).notNull(),
    minCartValue: (0, pg_core_1.decimal)('min_cart_value', { precision: 10, scale: 2 }).default('0'),
    active: (0, pg_core_1.boolean)('active').default(true),
});
exports.appSettings = (0, pg_core_1.pgTable)('app_settings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    settingKey: (0, pg_core_1.text)('setting_key').notNull().unique(),
    settingValue: (0, pg_core_1.text)('setting_value').notNull(),
});
exports.reviews = (0, pg_core_1.pgTable)('reviews', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => exports.users.id)
        .notNull(),
    productId: (0, pg_core_1.uuid)('product_id')
        .references(() => exports.products.id)
        .notNull(),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    comment: (0, pg_core_1.text)('comment'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.issues = (0, pg_core_1.pgTable)('issues', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => exports.users.id)
        .notNull(),
    subject: (0, pg_core_1.text)('subject').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('OPEN'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map