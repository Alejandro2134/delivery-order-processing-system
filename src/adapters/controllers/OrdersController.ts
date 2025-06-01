import { Order } from "@/domain/entities/Order";
import { CommonOperations } from "./interfaces/CommonOperations";
import { GetOrders } from "@/application/use_cases/orders/GetOrders";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { CreateOrder } from "@/application/use_cases/orders/CreateOrder";
import { AssignRobot } from "@/application/use_cases/orders/AssignRobot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ChangeStatus } from "@/application/use_cases/orders/ChangeStatus";
import { OrderAPI, orderSchema } from "../validators/order.schema";
import { IClientsRepository } from "@/domain/repositories/IClientsRepository";
import { IRestaurantsRepository } from "@/domain/repositories/IRestaurantsRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

export class OrdersController implements CommonOperations<Order, OrderAPI> {
  private ordersRepository: IOrdersRepository;
  private robotsRepository: IRobotsRepository;
  private clientsRepository: IClientsRepository;
  private restaurantsRepository: IRestaurantsRepository;
  private transactionsRepository: ITransactionsRepository;

  constructor(
    ordersRepository: IOrdersRepository,
    robotsRepository: IRobotsRepository,
    clientsRepository: IClientsRepository,
    restaurantsRepository: IRestaurantsRepository,
    transactionsRepository: ITransactionsRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.robotsRepository = robotsRepository;
    this.clientsRepository = clientsRepository;
    this.restaurantsRepository = restaurantsRepository;
    this.transactionsRepository = transactionsRepository;
  }

  assignRobot(orderId: number): Promise<Order> {
    const assignRobot = new AssignRobot(
      this.ordersRepository,
      this.robotsRepository,
      this.transactionsRepository
    );

    return assignRobot.execute(orderId);
  }

  changeStatus(orderId: number) {
    const changeStatus = new ChangeStatus(
      this.ordersRepository,
      this.robotsRepository,
      this.transactionsRepository
    );

    return changeStatus.execute(orderId);
  }

  create(item: OrderAPI): Promise<Order> {
    const validatedItem = orderSchema.parse(item);
    const createOrder = new CreateOrder(
      this.ordersRepository,
      this.clientsRepository,
      this.restaurantsRepository
    );
    return createOrder.execute(
      new Order({
        clientId: validatedItem.clientId,
        restaurantId: validatedItem.restaurantId,
        items: validatedItem.items,
      })
    );
  }

  list(): Promise<Order[]> {
    const getOrders = new GetOrders(this.ordersRepository);
    return getOrders.execute();
  }
}
