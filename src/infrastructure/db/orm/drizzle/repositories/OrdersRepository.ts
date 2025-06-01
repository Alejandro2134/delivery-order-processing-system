import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { Order } from "@/domain/entities/Order";
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import { ordersTable } from "../schema/order";
import { orderItemsTable } from "../schema/orderItems";
import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "..";
import { clientsTable } from "../schema/client";
import { restaurantTable } from "../schema/restaurant";
import { robotsTable } from "../schema/robot";
import { PgTransaction } from "drizzle-orm/pg-core";

type OrderRow = {
  orders: {
    id: number;
    clientId: number;
    restaurantId: number;
    robotId: number | null;
    completedAt: Date | null;
    createdAt: Date;
    status: "pending" | "assigned" | "picked_up" | "delivered" | "completed";
  };
  order_items?: {
    description: string;
    unitPrice: string;
    quantity: number;
  } | null;
  client?: {
    firstName: string;
    lastName: string;
    address: string;
  } | null;
  restaurant?: {
    name: string;
    address: string;
  } | null;
  robot?: {
    robotId: string;
  } | null;
};

export class OrdersRepository implements IOrdersRepository {
  private db: NodePgDatabase;

  constructor() {
    this.db = db();
  }

  async updateOrder(
    order: Order,
    id: number,
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ): Promise<Order> {
    const exec = tx ?? this.db;

    const updatedOrders = await exec
      .update(ordersTable)
      .set({
        robotId: order.getRobotId(),
        status: order.getStatus(),
        completedAt: order.getCompletedAt(),
      })
      .where(eq(ordersTable.id, id))
      .returning();

    if (updatedOrders.length === 0)
      throw new Error(`Order with id ${id} not found`);

    const updatedOrder = updatedOrders[0];
    const getOrder = await this.getOrder(updatedOrder.id, tx);

    if (!getOrder) throw new Error("Order not found");

    return getOrder;
  }

  async getOrder(
    id: number,
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ): Promise<Order | null> {
    const exec = tx ?? this.db;

    const rows = await exec
      .select({
        orders: { ...ordersTable },
        order_items: {
          description: orderItemsTable.description,
          unitPrice: orderItemsTable.unitPrice,
          quantity: orderItemsTable.quantity,
        },
        client: {
          firstName: clientsTable.firstName,
          lastName: clientsTable.lastName,
          address: clientsTable.address,
        },
        restaurant: {
          name: restaurantTable.name,
          address: restaurantTable.address,
        },
        robot: { robotId: robotsTable.robotId },
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(clientsTable, eq(ordersTable.clientId, clientsTable.id))
      .leftJoin(
        restaurantTable,
        eq(ordersTable.restaurantId, restaurantTable.id)
      )
      .leftJoin(robotsTable, eq(ordersTable.robotId, robotsTable.id))
      .for("update", { of: ordersTable });

    if (rows.length === 0) return null;

    const ordersMap = new Map<number, Order>();

    for (const row of rows) {
      const order = row.orders;
      const item = row.order_items;

      if (!ordersMap.has(order.id)) {
        const mappedOrder = this.mapRowToOrder(row);
        ordersMap.set(order.id, mappedOrder);
      }

      if (item) ordersMap.get(order.id)!.getItems().push(item);
    }

    return Array.from(ordersMap.values())[0];
  }

  async createOrder(order: Order): Promise<Order> {
    const createdOrders = await this.db
      .insert(ordersTable)
      .values({
        clientId: order.getClientId(),
        createdAt: order.getCreatedAt(),
        status: order.getStatus(),
        restaurantId: order.getRestaurantId(),
        robotId: order.getRobotId(),
        completedAt: order.getCompletedAt(),
      })
      .returning();

    const createdOrder = createdOrders[0];

    if (order.getItems().length > 0) {
      await this.db.insert(orderItemsTable).values(
        order.getItems().map((item) => ({
          description: item.description,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          orderId: createdOrder.id,
        }))
      );
    }

    const getOrder = await this.getOrder(createdOrder.id);
    if (!getOrder) throw new Error("Order not found");

    return getOrder;
  }

  async getOrders(): Promise<Order[]> {
    try {
      const rows = await this.db
        .select({
          orders: { ...ordersTable },
          order_items: {
            description: orderItemsTable.description,
            unitPrice: orderItemsTable.unitPrice,
            quantity: orderItemsTable.quantity,
          },
          client: {
            firstName: clientsTable.firstName,
            lastName: clientsTable.lastName,
            address: clientsTable.address,
          },
          restaurant: {
            name: restaurantTable.name,
            address: restaurantTable.address,
          },
          robot: { robotId: robotsTable.robotId },
        })
        .from(ordersTable)
        .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
        .leftJoin(clientsTable, eq(ordersTable.clientId, clientsTable.id))
        .leftJoin(
          restaurantTable,
          eq(ordersTable.restaurantId, restaurantTable.id)
        )
        .leftJoin(robotsTable, eq(ordersTable.robotId, robotsTable.id))
        .orderBy(ordersTable.id);

      const ordersMap = new Map<number, Order>();

      for (const row of rows) {
        const order = row.orders;
        const item = row.order_items;

        if (!ordersMap.has(order.id)) {
          const mappedOrder = this.mapRowToOrder(row);
          ordersMap.set(order.id, mappedOrder);
        }

        if (item) ordersMap.get(order.id)!.getItems().push(item);
      }

      return Array.from(ordersMap.values());
    } catch (err) {
      console.log(err);
      throw new Error("Error");
    }
  }

  mapRowToOrder(row: OrderRow): Order {
    const order = new Order({
      clientId: row.orders.clientId,
      restaurantId: row.orders.restaurantId,
      items: [],
    });

    order.setId(row.orders.id);
    order.setStatus(row.orders.status);
    order.setRobotId(row.orders.robotId);
    order.setCreatedAt(row.orders.createdAt);
    order.setCompletedAt(row.orders.completedAt);

    if (row.client)
      order.setClient({
        name: `${row.client.firstName} ${row.client.lastName}`,
        address: row.client.address,
      });
    if (row.restaurant)
      order.setRestaurantName({
        name: row.restaurant.name,
        address: row.restaurant.address,
      });
    if (row.robot) order.setRobotName(row.robot.robotId);

    return order;
  }
}
