import { IRobotFilter, Robot } from "@/domain/entities/Robot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";

export class GetRobots {
  private readonly robotsRepository: IRobotsRepository;

  constructor(robotsRepository: IRobotsRepository) {
    this.robotsRepository = robotsRepository;
  }

  async execute(filter: IRobotFilter): Promise<Robot[]> {
    return await this.robotsRepository.getRobots(filter);
  }
}
