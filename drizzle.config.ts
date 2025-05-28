import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://root:secret@localhost:5432/delivery-system",
  },
  schema: "./src/infrastructure/db/orm/drizzle/schema",
});
