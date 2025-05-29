import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { CreateOrder } from "../CreateOrder";
import { Order } from "@/domain/entities/Order";

describe("Create order use case", () => {
  it("should create a order and create the created order", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn().mockResolvedValue(order),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };

    const useCase = new CreateOrder(ordersRepository);

    //Act
    const createdOrder = await useCase.execute(order);

    //Assert
    expect(ordersRepository.createOrder).toHaveBeenCalledTimes(1);
    expect(ordersRepository.createOrder).toHaveBeenCalledWith(order);
    expect(createdOrder).toBe(order);
  });
});
