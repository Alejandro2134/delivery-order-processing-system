import { Robot } from "@/domain/entities/Robot";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ChangeStatus } from "../ChangeStatus";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";
import { Order } from "@/domain/entities/Order";

describe("Change status use case", () => {
  it("should change the status of the robot if the new status is different from busy", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-123" });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn().mockResolvedValue(robot),
    };

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
      updateOrder: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new ChangeStatus(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

    //Act
    const res = await useCase.execute(1, "offline");

    //Assert
    expect(res.getStatus()).toBe("offline");
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

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
      updateOrder: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new ChangeStatus(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

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

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
      updateOrder: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new ChangeStatus(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

    //Act & Assert
    await expect(useCase.execute(1, "busy")).rejects.toThrow(
      "Robot with id 1 not found"
    );
  });

  it("should change the status of the robot if the new status is busy and assign the robot to a order", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-123" });
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn().mockResolvedValue(robot),
    };

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn().mockResolvedValue(order),
      updateOrder: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new ChangeStatus(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

    //Act
    const res = await useCase.execute(1, "busy");

    //Assert
    expect(res.getStatus()).toBe("busy");
    expect(ordersRepository.getPendingOrder).toHaveBeenCalledTimes(1);
    expect(ordersRepository.updateOrder).toHaveBeenCalledTimes(1);
    expect(robotsRepository.updateRobot).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the new status is busy but there is no pending order", async () => {
    //Arrange
    const robot = new Robot({ robotId: "ROBOT-123" });

    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn().mockResolvedValue(robot),
    };

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn().mockResolvedValue(null),
      updateOrder: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new ChangeStatus(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

    //Act & Assert
    await expect(useCase.execute(1, "busy")).rejects.toThrow(
      "No pending orders available"
    );
  });
});
