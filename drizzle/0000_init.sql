CREATE TYPE "public"."order_status" AS ENUM('pending', 'assigned', 'picked_up', 'delivered', 'completed');--> statement-breakpoint
CREATE TYPE "public"."robot_status" AS ENUM('available', 'busy', 'offline');--> statement-breakpoint
CREATE TABLE "clients" (
	"client_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clients_client_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"address" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"oder_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_oder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"restaurant_id" integer NOT NULL,
	"robot_id" integer,
	"completed_at" timestamp,
	"created_at" timestamp NOT NULL,
	"status" "order_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_order_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"description" varchar NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"order_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"restaurant_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "restaurants_restaurant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"address" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "robots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "robots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"robot_id" text NOT NULL,
	"status" "robot_status" NOT NULL,
	"last_known_location" varchar NOT NULL,
	CONSTRAINT "robots_robot_id_unique" UNIQUE("robot_id")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("client_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_id_restaurants_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_robot_id_robots_id_fk" FOREIGN KEY ("robot_id") REFERENCES "public"."robots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_oder_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("oder_id") ON DELETE no action ON UPDATE no action;