import { Restaurant } from "../entities/Restaurant";

export interface IRestaurantsRepository {
  getRestaurant(id: number): Promise<Restaurant | null>;
}
