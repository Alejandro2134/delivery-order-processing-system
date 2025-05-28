import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, numeric } from "drizzle-orm/pg-core";
import { ordersTable } from "./order";

export const orderItemsTable = pgTable("order_items", {
  id: integer("order_item_id").primaryKey().generatedAlwaysAsIdentity(),
  description: varchar().notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer().notNull(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id),
});

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
}));
