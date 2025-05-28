import { Robot } from "@/domain/entities/Robot";
import { IIdGenerator } from "@/domain/repositories/IIdGenerator";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";

export class CreateRobot {
  private readonly robotsRepository: IRobotsRepository;
  private readonly uuidGenerator: IIdGenerator;

  constructor(
    robotsRepository: IRobotsRepository,
    uuidGenerator: IIdGenerator
  ) {
    this.uuidGenerator = uuidGenerator;
    this.robotsRepository = robotsRepository;
  }

  async execute(): Promise<Robot> {
    const robot = new Robot({
      robotId: `ROBOT-${this.uuidGenerator.generate()}`,
    });
    return this.robotsRepository.createRobot(robot);
  }
}
