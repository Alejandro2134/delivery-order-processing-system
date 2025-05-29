import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { GetOrders } from "../GetOrders";
import { Order } from "@/domain/entities/Order";

describe("Get orders use case", () => {
  it("should return a list of orders", async () => {
    //Arrange
    const orders = [
      new Order({ clientId: 1, items: [], restaurantId: 2 }),
      new Order({ clientId: 2, items: [], restaurantId: 5 }),
    ];

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn().mockResolvedValue(orders),
      updateOrder: jest.fn(),
    };

    const useCase = new GetOrders(ordersRepository);

    //Act
    const ordersList = await useCase.execute();

    //Assert
    expect(ordersList).toBe(orders);
    expect(ordersRepository.getOrders).toHaveBeenCalledTimes(1);
  });
});
