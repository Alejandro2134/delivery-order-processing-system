import { Robot } from "@/domain/entities/Robot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { GetRobots } from "../GetRobots";

describe("Get robots use case", () => {
  it("should return a list of robots", async () => {
    //Arrange
    const robots = [new Robot({ robotId: "1" }), new Robot({ robotId: "2" })];

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn().mockResolvedValue(robots),
      updateRobot: jest.fn(),
    };

    const useCase = new GetRobots(robotsRepository);

    //Act
    const res = await useCase.execute();

    //Assert
    expect(res).toBe(robots);
    expect(robotsRepository.getRobots).toHaveBeenCalledTimes(1);
  });
});
