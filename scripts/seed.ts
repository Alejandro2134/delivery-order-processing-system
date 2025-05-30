import { db } from "@/infrastructure/db/orm/drizzle";
import { clientsTable } from "@/infrastructure/db/orm/drizzle/schema/client";
import { restaurantTable } from "@/infrastructure/db/orm/drizzle/schema/restaurant";
import { seed } from "drizzle-seed";

async function pupulateDb() {
  const existingClients = await db().select().from(clientsTable).limit(1);
  if (existingClients.length > 0) {
    console.log("Database already populated with clients.");
    return;
  }

  await seed(db(), { clientsTable, restaurantTable }).refine((f) => ({
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
}

pupulateDb().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
