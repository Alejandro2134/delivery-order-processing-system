import { Order } from "@/domain/entities/Order";
import { IClientsRepository } from "@/domain/repositories/IClientsRepository";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRestaurantsRepository } from "@/domain/repositories/IRestaurantsRepository";

export class CreateOrder {
  private readonly ordersRepository: IOrdersRepository;
  private readonly clientsRepository: IClientsRepository;
  private readonly restaurantsRepository: IRestaurantsRepository;

  constructor(
    ordersRepository: IOrdersRepository,
    clientsRepository: IClientsRepository,
    restaurantsRepository: IRestaurantsRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.clientsRepository = clientsRepository;
    this.restaurantsRepository = restaurantsRepository;
  }

  async execute(order: Order): Promise<Order> {
    const client = await this.clientsRepository.getClient(order.getClientId());
    if (!client)
      throw new Error(`Client with id ${order.getClientId()} not found`);

    const restaurant = await this.restaurantsRepository.getRestaurant(
      order.getRestaurantId()
    );
    if (!restaurant)
      throw new Error(
        `Restaurant with id ${order.getRestaurantId()} not found`
      );

    return await this.ordersRepository.createOrder(order);
  }
}
