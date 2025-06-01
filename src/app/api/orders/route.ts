import { OrderAPI } from "@/adapters/validators/order.schema";
import { OrdersController } from "@/adapters/controllers/OrdersController";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";
import { z } from "zod";
import { ClientsRepository } from "@/infrastructure/db/orm/drizzle/repositories/ClientsRepository";
import { RestaurantsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RestaurantsRepository";

export async function GET() {
  try {
    const ordersRepository = new OrdersRepository();
    const robotsRepository = new RobotsRepository();
    const clientsRepository = new ClientsRepository();
    const restaurantsRepository = new RestaurantsRepository();
    const ordersController = new OrdersController(
      ordersRepository,
      robotsRepository,
      clientsRepository,
      restaurantsRepository
    );
    const orders = await ordersController.list();
    return Response.json(orders, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body: OrderAPI = await request.json();
    const ordersRepository = new OrdersRepository();
    const robotsRepository = new RobotsRepository();
    const clientsRepository = new ClientsRepository();
    const restaurantsRepository = new RestaurantsRepository();
    const ordersController = new OrdersController(
      ordersRepository,
      robotsRepository,
      clientsRepository,
      restaurantsRepository
    );
    const order = await ordersController.create(body);
    return Response.json(order, { status: 201 });
  } catch (err: unknown) {
    let errorMessage: string = "Unexpected Error";
    let zodIssues: z.ZodIssue[] = [];
    let statusCode = 500;

    if (err instanceof z.ZodError) {
      errorMessage = "Validation Error";
      statusCode = 400;
      zodIssues = err.issues;
    } else if (err instanceof Error) {
      errorMessage = err.message;
      statusCode = 400;
    }

    return Response.json(
      { error: errorMessage, issues: zodIssues },
      { status: statusCode }
    );
  }
}
