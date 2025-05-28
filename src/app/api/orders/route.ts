import { OrderAPI } from "@/adapters/controllers/interfaces/OrderAPI";
import { OrdersController } from "@/adapters/controllers/OrdersController";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function GET() {
  const ordersRepository = new OrdersRepository();
  const robotsRepository = new RobotsRepository();
  const ordersController = new OrdersController(
    ordersRepository,
    robotsRepository
  );
  const orders = await ordersController.list();
  return Response.json(orders, { status: 200 });
}

export async function POST(request: Request) {
  const body: OrderAPI = await request.json();
  const ordersRepository = new OrdersRepository();
  const robotsRepository = new RobotsRepository();
  const ordersController = new OrdersController(
    ordersRepository,
    robotsRepository
  );
  const order = await ordersController.create(body);
  return Response.json(order, { status: 201 });
}
