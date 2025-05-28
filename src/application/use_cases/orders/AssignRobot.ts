import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";

export class AssignRobot {
  private readonly ordersRepository: IOrdersRepository;
  private readonly robotsRepository: IRobotsRepository;

  constructor(
    ordersRepository: IOrdersRepository,
    robotsRepository: IRobotsRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.robotsRepository = robotsRepository;
  }

  async execute(orderId: number) {
    const order = await this.ordersRepository.getOrder(orderId);
    if (!order) throw new Error(`Order with ID ${orderId} not found`);

    if (order.getStatus() !== "pending")
      throw new Error(`Order with ID ${orderId} is not in a pending state`);

    const robot = await this.robotsRepository.getAvailableRobot();
    if (!robot) throw new Error(`No available robot found`);

    order.changeStatus(robot);

    await this.robotsRepository.updateRobot(robot, robot.getId());
    return await this.ordersRepository.updateOrder(order, orderId);
  }
}
