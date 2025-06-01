import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { CreateOrder } from "../CreateOrder";
import { Order } from "@/domain/entities/Order";
import { IClientsRepository } from "@/domain/repositories/IClientsRepository";
import { IRestaurantsRepository } from "@/domain/repositories/IRestaurantsRepository";
import { Client } from "@/domain/entities/Client";
import { Restaurant } from "@/domain/entities/Restaurant";

describe("Create order use case", () => {
  it("should create a order and return the created order", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    const client = new Client({
      address: "KRA 1",
      firstName: "Alejo",
      lastName: "Zapata",
      phoneNumber: "57",
    });
    const restaurant = new Restaurant({
      address: "KRA 2",
      name: "Dormin",
      phoneNumber: "58",
    });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn().mockResolvedValue(order),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };

    const clientsRepository: IClientsRepository = {
      getClient: jest.fn().mockResolvedValue(client),
    };

    const restaurantsRepository: IRestaurantsRepository = {
      getRestaurant: jest.fn().mockResolvedValue(restaurant),
    };

    const useCase = new CreateOrder(
      ordersRepository,
      clientsRepository,
      restaurantsRepository
    );

    //Act
    const createdOrder = await useCase.execute(order);

    //Assert
    expect(ordersRepository.createOrder).toHaveBeenCalledTimes(1);
    expect(ordersRepository.createOrder).toHaveBeenCalledWith(order);
    expect(createdOrder).toBe(order);
  });

  it("should throw an error if the order client don't exist", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };

    const clientsRepository: IClientsRepository = {
      getClient: jest.fn().mockResolvedValue(null),
    };

    const restaurantsRepository: IRestaurantsRepository = {
      getRestaurant: jest.fn(),
    };

    const useCase = new CreateOrder(
      ordersRepository,
      clientsRepository,
      restaurantsRepository
    );

    //Act & Assert
    await expect(useCase.execute(order)).rejects.toThrow(
      "Client with id 1 not found"
    );
  });

  it("should throw an error if the order restaurant don't exist", async () => {
    //Arrange
    const order = new Order({ clientId: 1, items: [], restaurantId: 1 });
    const client = new Client({
      address: "KRA 1",
      firstName: "Alejo",
      lastName: "Zapata",
      phoneNumber: "57",
    });

    const ordersRepository: IOrdersRepository = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getOrders: jest.fn(),
      updateOrder: jest.fn(),
    };

    const clientsRepository: IClientsRepository = {
      getClient: jest.fn().mockResolvedValue(client),
    };

    const restaurantsRepository: IRestaurantsRepository = {
      getRestaurant: jest.fn().mockResolvedValue(null),
    };

    const useCase = new CreateOrder(
      ordersRepository,
      clientsRepository,
      restaurantsRepository
    );

    //Act & Assert
    await expect(useCase.execute(order)).rejects.toThrow(
      "Restaurant with id 1 not found"
    );
  });
});
