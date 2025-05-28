import { integer, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { clientsTable } from "./client";
import { restaurantTable } from "./restaurant";
import { robotsTable } from "./robot";
import { orderItemsTable } from "./orderItems";

export const statusEnum = pgEnum("order_status", [
  "pending",
  "assigned",
  "picked_up",
  "delivered",
  "completed",
]);

export const ordersTable = pgTable("orders", {
  id: integer("oder_id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clientsTable.id),
  restaurantId: integer("restaurant_id")
    .notNull()
    .references(() => restaurantTable.id),
  robotId: integer("robot_id").references(() => robotsTable.id),
  completedAt: timestamp("completed_at", {
    mode: "date",
    withTimezone: false,
  }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  status: statusEnum().notNull(),
});

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  client: one(clientsTable, {
    fields: [ordersTable.clientId],
    references: [clientsTable.id],
  }),
  restaurant: one(restaurantTable, {
    fields: [ordersTable.restaurantId],
    references: [restaurantTable.id],
  }),
  robot: one(robotsTable, {
    fields: [ordersTable.robotId],
    references: [robotsTable.id],
  }),
  items: many(orderItemsTable),
}));
