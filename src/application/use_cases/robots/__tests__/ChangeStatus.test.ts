import { Robot } from "@/domain/entities/Robot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ChangeStatus } from "../ChangeStatus";

describe("Change status use case", () => {
  it("should change the status of the robot", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-123" });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn().mockResolvedValue(robot),
    };

    const useCase = new ChangeStatus(robotsRepository);

    //Act
    const res = await useCase.execute(1, "busy");

    //Assert
    expect(res.getStatus()).toBe("busy");
    expect(robotsRepository.getRobot).toHaveBeenCalledTimes(1);
    expect(robotsRepository.updateRobot).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the sent status is not available", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-123" });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn().mockResolvedValue(robot),
    };

    const useCase = new ChangeStatus(robotsRepository);

    //Act & Assert
    await expect(useCase.execute(1, "asdasd")).rejects.toThrow(
      "Invalid status: asdasd"
    );
  });

  it("should throw an error if the robot don't exist", async () => {
    //Arrange

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(null),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(robotsRepository);

    //Act & Assert
    await expect(useCase.execute(1, "busy")).rejects.toThrow(
      "Robot with id 1 not found"
    );
  });
});
