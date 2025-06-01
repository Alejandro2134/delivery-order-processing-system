import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { AssignRobot } from "../AssignRobot";
import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

describe("Assign robot to order use case", () => {
  it("should assign a robot to a pending order", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    const robot = new Robot({ robotId: "ROBOT-1232" });

    const ordersRepository: IOrdersRepository = {
      getOrder: jest.fn().mockResolvedValue(order),
      updateOrder: jest.fn().mockResolvedValue(order),
      createOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
    };

    const robotsRepository: IRobotsRepository = {
      getAvailableRobot: jest.fn().mockResolvedValue(robot),
      updateRobot: jest.fn().mockResolvedValue(robot),
      createRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new AssignRobot(
      ordersRepository,
      robotsRepository,
      transactionsRepository
    );

    //Act
    const result = await useCase.execute(1);

    //Assert
    expect(ordersRepository.getOrder).toHaveBeenCalledWith(1, undefined);
    expect(robotsRepository.getAvailableRobot).toHaveBeenCalled();
    expect(order.getRobotId()).toBe(robot.getId());
    expect(order.getStatus()).toBe("assigned");
    expect(robot.getStatus()).toBe("busy");
    expect(result).toBe(order);
  });

  it("should throw an error if the order dont exist", async () => {
    //Arrange
    const ordersRepository: IOrdersRepository = {
      getOrder: jest.fn().mockResolvedValue(null),
      updateOrder: jest.fn(),
      createOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
    };

    const robotsRepository: IRobotsRepository = {
      getAvailableRobot: jest.fn(),
      updateRobot: jest.fn(),
      createRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new AssignRobot(
      ordersRepository,
      robotsRepository,
      transactionsRepository
    );

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "Order with ID 1 not found"
    );
  });

  it("should throw an error if the order is not in a pending state", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    order.setStatus("completed");

    const ordersRepository: IOrdersRepository = {
      getOrder: jest.fn().mockResolvedValue(order),
      updateOrder: jest.fn(),
      createOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
    };

    const robotsRepository: IRobotsRepository = {
      getAvailableRobot: jest.fn(),
      updateRobot: jest.fn(),
      createRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new AssignRobot(
      ordersRepository,
      robotsRepository,
      transactionsRepository
    );

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "Order with ID 1 is not in a pending state"
    );
  });

  it("should throw an error if no available robot is found", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });

    const ordersRepository: IOrdersRepository = {
      getOrder: jest.fn().mockResolvedValue(order),
      updateOrder: jest.fn(),
      createOrder: jest.fn(),
      getOrders: jest.fn(),
      getPendingOrder: jest.fn(),
    };

    const robotsRepository: IRobotsRepository = {
      getAvailableRobot: jest.fn().mockResolvedValue(null),
      updateRobot: jest.fn(),
      createRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
    };

    const transactionsRepository: ITransactionsRepository = {
      runInTransaction: async (fn) => {
        return await fn(undefined);
      },
    };

    const useCase = new AssignRobot(
      ordersRepository,
      robotsRepository,
      transactionsRepository
    );

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "No available robot found"
    );
  });
});
