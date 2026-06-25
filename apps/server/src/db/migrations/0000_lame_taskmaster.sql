CREATE SCHEMA "ecom";
--> statement-breakpoint
CREATE TABLE "ecom"."app_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"setting_key" text NOT NULL,
	"setting_value" text NOT NULL,
	CONSTRAINT "app_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "ecom"."discounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"min_cart_value" numeric(10, 2) DEFAULT '0',
	"active" boolean DEFAULT true,
	CONSTRAINT "discounts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "ecom"."order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ecom"."orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'ACKNOWLEDGED' NOT NULL,
	"payment_id" text,
	"tracking_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ecom"."products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ecom"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"google_id" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ecom"."order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "ecom"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecom"."order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "ecom"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ecom"."orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ecom"."users"("id") ON DELETE no action ON UPDATE no action;