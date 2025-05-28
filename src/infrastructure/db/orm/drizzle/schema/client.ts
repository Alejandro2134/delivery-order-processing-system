import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const clientsTable = pgTable("clients", {
  id: integer("client_id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  address: varchar().notNull(),
});
