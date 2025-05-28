import { integer, varchar, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("robot_status", [
  "available",
  "busy",
  "offline",
]);

export const robotsTable = pgTable("robots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  robotId: text("robot_id").unique().notNull(),
  status: statusEnum().notNull(),
  lastKnownLocation: varchar("last_known_location").notNull(),
});
