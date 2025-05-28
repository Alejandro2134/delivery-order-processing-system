import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: {
    connectionString: "postgresql://root:secret@localhost:5432/delivery-system",
  },
});
