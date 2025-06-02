import { IOrderFilter, Order } from "@/domain/entities/Order";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";

export class GetOrders {
  private readonly ordersRepository: IOrdersRepository;

  constructor(ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async execute(filter: IOrderFilter): Promise<Order[]> {
    return await this.ordersRepository.getOrders(filter);
  }
}
