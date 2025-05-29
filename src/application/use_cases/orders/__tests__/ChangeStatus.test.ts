import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ChangeStatus } from "../ChangeStatus";
import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";

describe("Change status use case", () => {
  it("should change the status of an order if the order already has a robot assigned", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    order.setRobotId(1);

    const robot = new Robot({ robotId: "ROBOT-12314" });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn().mockResolvedValue(order),
      getOrders: jest.fn(),
      updateOrder: jest.fn().mockResolvedValue(order),
    };
    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(robot),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(ordersRepository, robotsRepository);

    //Act
    const updatedOrder = await useCase.execute(1);

    //Assert
    expect(updatedOrder.getStatus()).toBe("assigned");
    expect(ordersRepository.getOrder).toHaveBeenCalledWith(1);
    expect(robotsRepository.updateRobot).toHaveBeenCalledTimes(1);
    expect(ordersRepository.updateOrder).toHaveBeenCalledTimes(1);
    expect(robotsRepository.getRobot).toHaveBeenCalledTimes(1);
  });

  it("should change the status of an order if the order doesn't have a robot assigned", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    const robot = new Robot({ robotId: "ROBOT-12314" });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn().mockResolvedValue(order),
      getOrders: jest.fn(),
      updateOrder: jest.fn().mockResolvedValue(order),
    };
    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn().mockResolvedValue(robot),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(ordersRepository, robotsRepository);

    //Act
    const updatedOrder = await useCase.execute(1);

    //Assert
    expect(updatedOrder.getStatus()).toBe("assigned");
    expect(ordersRepository.getOrder).toHaveBeenCalledWith(1);
    expect(robotsRepository.updateRobot).toHaveBeenCalledTimes(1);
    expect(ordersRepository.updateOrder).toHaveBeenCalledTimes(1);
    expect(robotsRepository.getAvailableRobot).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the order don't exist", async () => {
    //Arrange
    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn().mockResolvedValue(null),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };
    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(ordersRepository, robotsRepository);

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "Order with ID 1 not found"
    );
  });

  it("should throw an error if the robot assigned to the order don't exist", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    order.setRobotId(1);

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn().mockResolvedValue(order),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };
    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn(),
      getRobot: jest.fn().mockResolvedValue(null),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(ordersRepository, robotsRepository);

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "Robot with ID 1 not found"
    );
  });

  it("should throw an error if there is no available robot", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn().mockResolvedValue(order),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };
    const robotsRepository: IRobotsRepository = {
      createRobot: jest.fn(),
      getAvailableRobot: jest.fn().mockResolvedValue(null),
      getRobot: jest.fn(),
      getRobots: jest.fn(),
      updateRobot: jest.fn(),
    };

    const useCase = new ChangeStatus(ordersRepository, robotsRepository);

    //Act & Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "No available robot found"
    );
  });
});
