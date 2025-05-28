import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";

export class ChangeStatus {
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

    const robotId = order.getRobotId();

    if (robotId) {
      const robot = await this.robotsRepository.getRobot(robotId);
      if (!robot) throw new Error(`Robot with ID ${robotId} not found`);
      order.changeStatus(robot);
      await this.robotsRepository.updateRobot(robot, robotId);
      return await this.ordersRepository.updateOrder(order, orderId);
    } else {
      const robot = await this.robotsRepository.getAvailableRobot();
      if (!robot) throw new Error(`No available robot found`);
      order.changeStatus(robot);
      await this.robotsRepository.updateRobot(robot, robot.getId());
      return await this.ordersRepository.updateOrder(order, orderId);
    }
  }
}
