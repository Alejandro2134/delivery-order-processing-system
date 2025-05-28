import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const restaurantTable = pgTable("restaurants", {
  id: integer("restaurant_id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  address: varchar().notNull(),
});
