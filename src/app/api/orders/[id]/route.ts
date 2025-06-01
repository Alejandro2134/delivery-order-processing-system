import { OrdersController } from "@/adapters/controllers/OrdersController";
import { ClientsRepository } from "@/infrastructure/db/orm/drizzle/repositories/ClientsRepository";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RestaurantsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RestaurantsRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";
import { TransacionsRepository } from "@/infrastructure/db/orm/drizzle/repositories/TransactionsRepository";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = parseInt(id, 10);
    const ordersRepository = new OrdersRepository();
    const robotsRepository = new RobotsRepository();
    const clientsRepository = new ClientsRepository();
    const restaurantsRepository = new RestaurantsRepository();
    const transactionsRepository = new TransacionsRepository();
    const ordersController = new OrdersController(
      ordersRepository,
      robotsRepository,
      clientsRepository,
      restaurantsRepository,
      transactionsRepository
    );
    const order = await ordersController.assignRobot(orderId);
    return Response.json(order, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
