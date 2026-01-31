-- Migration: Create Menu Online Orders tables
-- Description: Adds Order, OrderItem, and OrderItemModifier tables for menu-online module

-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'in_delivery', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderDeliveryType" AS ENUM ('delivery', 'pickup', 'dine_in');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create menu_online_orders table
CREATE TABLE IF NOT EXISTS "menu_online_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenant_id" TEXT NOT NULL,
    "public_order_code" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashback_used" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "delivery_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_email" TEXT,
    "delivery_type" "OrderDeliveryType" NOT NULL,
    "delivery_address" TEXT,
    "delivery_district" TEXT,
    "delivery_city" TEXT,
    "delivery_state" TEXT,
    "delivery_zip" TEXT,
    "delivery_number" TEXT,
    "delivery_complement" TEXT,
    "delivery_reference" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create menu_online_order_items table
CREATE TABLE IF NOT EXISTS "menu_online_order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name_snapshot" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "variation_id" TEXT,
    "variation_name" TEXT,
    "variation_price" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_online_order_item_modifiers table
CREATE TABLE IF NOT EXISTS "menu_online_order_item_modifiers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenant_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "modifier_name" TEXT NOT NULL,
    "option_name" TEXT NOT NULL,
    "price_delta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for menu_online_orders
CREATE UNIQUE INDEX IF NOT EXISTS "menu_online_orders_tenant_id_public_order_code_key" ON "menu_online_orders"("tenant_id", "public_order_code");
CREATE INDEX IF NOT EXISTS "menu_online_orders_tenant_id_idx" ON "menu_online_orders"("tenant_id");
CREATE INDEX IF NOT EXISTS "menu_online_orders_public_order_code_idx" ON "menu_online_orders"("public_order_code");
CREATE INDEX IF NOT EXISTS "menu_online_orders_status_idx" ON "menu_online_orders"("status");
CREATE INDEX IF NOT EXISTS "menu_online_orders_created_at_idx" ON "menu_online_orders"("created_at");

-- Create indexes for menu_online_order_items
CREATE INDEX IF NOT EXISTS "menu_online_order_items_tenant_id_idx" ON "menu_online_order_items"("tenant_id");
CREATE INDEX IF NOT EXISTS "menu_online_order_items_order_id_idx" ON "menu_online_order_items"("order_id");
CREATE INDEX IF NOT EXISTS "menu_online_order_items_product_id_idx" ON "menu_online_order_items"("product_id");

-- Create indexes for menu_online_order_item_modifiers
CREATE INDEX IF NOT EXISTS "menu_online_order_item_modifiers_tenant_id_idx" ON "menu_online_order_item_modifiers"("tenant_id");
CREATE INDEX IF NOT EXISTS "menu_online_order_item_modifiers_order_item_id_idx" ON "menu_online_order_item_modifiers"("order_item_id");
