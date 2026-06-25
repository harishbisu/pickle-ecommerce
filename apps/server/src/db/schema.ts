import {
  serial,
  text,
  integer,
  boolean,
  pgSchema,
  timestamp,
  jsonb,
  decimal,
} from 'drizzle-orm/pg-core';
export const ecomSchema = pgSchema('ecom');

export const users = ecomSchema.table('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  googleId: text('google_id'),
  role: text('role').notNull().default('USER'), // USER, ADMIN
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = ecomSchema.table('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  images: jsonb('images').notNull().default([]), // array of image URLs
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = ecomSchema.table('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('ACKNOWLEDGED'), // ACKNOWLEDGED, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED
  paymentId: text('payment_id'),
  trackingId: text('tracking_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItems = ecomSchema.table('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});

export const discounts = ecomSchema.table('discounts', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // PERCENTAGE, FIXED
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minCartValue: decimal('min_cart_value', { precision: 10, scale: 2 }).default(
    '0',
  ),
  active: boolean('active').default(true),
});

export const appSettings = ecomSchema.table('app_settings', {
  id: serial('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value').notNull(),
});
