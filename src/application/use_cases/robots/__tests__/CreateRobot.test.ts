import { IIdGenerator } from "@/domain/repositories/IIdGenerator";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { CreateRobot } from "../CreateRobot";
import { Robot } from "@/domain/entities/Robot";

describe("Create robot use case", () => {
  it("should create a robot and return the created robot", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-1234556" });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn().mockResolvedValue(robot),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const uuidGenerator: IIdGenerator = {
      generate: jest.fn().mockResolvedValue("1234556"),
    };

    const useCase = new CreateRobot(robotsRepository, uuidGenerator);

    //Act
    const createdRobot = await useCase.execute();

    //Assert
    expect(robotsRepository.createRobot).toHaveBeenCalledTimes(1);
    expect(createdRobot.getRobotId()).toBe("ROBOT-1234556");
  });
});
