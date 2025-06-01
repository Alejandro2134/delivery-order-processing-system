import { RobotStatus } from "@/domain/entities/Robot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";

const AVAILABLE_STATUS: RobotStatus[] = ["available", "busy", "offline"];

export class ChangeStatus {
  private readonly robotsRepository: IRobotsRepository;

  constructor(robotsRepository: IRobotsRepository) {
    this.robotsRepository = robotsRepository;
  }

  async execute(id: number, newStatus: string) {
    if (!AVAILABLE_STATUS.includes(newStatus as RobotStatus))
      throw new Error(`Invalid status: ${newStatus}`);

    const robot = await this.robotsRepository.getRobot(id);
    if (!robot) throw new Error(`Robot with id ${id} not found`);

    robot.changeStatus(newStatus as RobotStatus);
    return await this.robotsRepository.updateRobot(robot, id);
  }
}
