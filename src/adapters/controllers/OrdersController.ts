import { Order } from "@/domain/entities/Order";
import { CommonOperations } from "./interfaces/CommonOperations";
import { GetOrders } from "@/application/use_cases/orders/GetOrders";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { OrderAPI } from "./interfaces/OrderAPI";
import { CreateOrder } from "@/application/use_cases/orders/CreateOrder";
import { AssignRobot } from "@/application/use_cases/orders/AssignRobot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ChangeStatus } from "@/application/use_cases/orders/ChangeStatus";

export class OrdersController implements CommonOperations<Order, OrderAPI> {
  private ordersRepository: IOrdersRepository;
  private robotsRepository: IRobotsRepository;

  constructor(
    ordersRepository: IOrdersRepository,
    robotsRepository: IRobotsRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.robotsRepository = robotsRepository;
  }

  assignRobot(orderId: number): Promise<Order> {
    const assignRobot = new AssignRobot(
      this.ordersRepository,
      this.robotsRepository
    );

    return assignRobot.execute(orderId);
  }

  changeStatus(orderId: number) {
    const changeStatus = new ChangeStatus(
      this.ordersRepository,
      this.robotsRepository
    );

    return changeStatus.execute(orderId);
  }

  create(item: OrderAPI): Promise<Order> {
    const createOrder = new CreateOrder(this.ordersRepository);
    return createOrder.execute(
      new Order({
        clientId: item.clientId,
        restaurantId: item.restaurantId,
        items: item.items || [],
      })
    );
  }

  list(): Promise<Order[]> {
    const getOrders = new GetOrders(this.ordersRepository);
    return getOrders.execute();
  }
}
