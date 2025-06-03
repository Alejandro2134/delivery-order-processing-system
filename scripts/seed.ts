import "../envConfig";
import { seed } from "drizzle-seed";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { clientsTable } from "@/infrastructure/db/orm/drizzle/schema/client";
import { restaurantTable } from "@/infrastructure/db/orm/drizzle/schema/restaurant";

(async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const existingClients = await db.select().from(clientsTable).limit(1);
    if (existingClients.length > 0) return;

    await seed(db, { clientsTable, restaurantTable }).refine((f) => ({
      clientsTable: {
        columns: {
          phoneNumber: f.phoneNumber(),
          address: f.streetAddress(),
        },
      },
      restaurantTable: {
        columns: {
          name: f.companyName(),
          phoneNumber: f.phoneNumber(),
          address: f.streetAddress(),
        },
      },
    }));

    console.log("Database seeded with initial data.");
  } catch (err) {
    console.error("Error seeding database", err);
  }
})();
