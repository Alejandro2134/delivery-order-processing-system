import "../../../../../envConfig";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import { Pool } from "pg";
import { clientsTable } from "./schema/client";
import { restaurantTable } from "./schema/restaurant";

let dbInstance: NodePgDatabase | null = null;

export const db = () => {
  if (!dbInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not defined");

    const pool = new Pool({ connectionString: url });
    dbInstance = drizzle(pool);
    populateDb();
  }

  return dbInstance;
};

const populateDb = async () => {
  const existingClients = await dbInstance!
    .select()
    .from(clientsTable)
    .limit(1);

  if (existingClients.length > 0) return;

  await seed(dbInstance!, { clientsTable, restaurantTable }).refine((f) => ({
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
};
