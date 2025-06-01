import { Restaurant } from "@/domain/entities/Restaurant";
import { IRestaurantsRepository } from "@/domain/repositories/IRestaurantsRepository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { restaurantTable } from "../schema/restaurant";
import { db } from "..";
import { eq } from "drizzle-orm";

type RestaurantRow = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
};

export class RestaurantsRepository implements IRestaurantsRepository {
  private db: NodePgDatabase;

  constructor() {
    this.db = db();
  }

  async getRestaurant(id: number): Promise<Restaurant | null> {
    const rows = await this.db
      .select()
      .from(restaurantTable)
      .where(eq(restaurantTable.id, id));

    if (rows.length === 0) return null;
    const row = rows[0];

    return this.mapRowToRestaurant(row);
  }

  mapRowToRestaurant(row: RestaurantRow) {
    const restaurant = new Restaurant({
      address: row.address,
      name: row.name,
      phoneNumber: row.phoneNumber,
    });

    return restaurant;
  }
}
