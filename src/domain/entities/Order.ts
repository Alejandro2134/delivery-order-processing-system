import { AssignedState } from "../states/orders/AssignedState";
import { CompletedState } from "../states/orders/CompletedState";
import { DeliveredState } from "../states/orders/DeliveredState";
import { PendingState } from "../states/orders/PendingState";
import { PickedUpState } from "../states/orders/PickedUpState";
import { Robot } from "./Robot";

interface IOrder {
  clientId: number;
  restaurantId: number;
  items: OrderItems[];
}

type OrderItems = {
  quantity: number;
  description: string;
  unitPrice: string;
};

export type OrderStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "delivered"
  | "completed";

const STATE_MAP = {
  pending: new PendingState(),
  assigned: new AssignedState(),
  picked_up: new PickedUpState(),
  delivered: new DeliveredState(),
  completed: new CompletedState(),
};

export class Order {
  private id: number;
  private clientId: number;
  private restaurantId: number;
  private robotId: number | null;
  private items: OrderItems[];
  private createdAt: Date;
  private completedAt: Date | null;
  private status: OrderStatus;
  private client: { name: string; address: string } | null;
  private restaurant: { name: string; address: string } | null;
  private robotName: string | null;

  constructor(order: IOrder) {
    this.id = 0;
    this.clientId = order.clientId;
    this.restaurantId = order.restaurantId;
    this.robotId = null;
    this.items = order.items;
    this.createdAt = new Date();
    this.completedAt = null;
    this.status = "pending";
    this.client = null;
    this.restaurant = null;
    this.robotName = null;
  }

  public getClientId(): number {
    return this.clientId;
  }

  public getRestaurantId(): number {
    return this.restaurantId;
  }

  public getRobotId(): number | null {
    return this.robotId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getCompletedAt(): Date | null {
    return this.completedAt;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getItems(): OrderItems[] {
    return this.items;
  }

  public setItems(items: OrderItems[]): void {
    this.items = items;
  }

  public getId(): number {
    return this.id;
  }

  public setClient(client: { name: string; address: string }): void {
    this.client = client;
  }

  public setRestaurantName(restaurant: {
    name: string;
    address: string;
  }): void {
    this.restaurant = restaurant;
  }

  public getClient(): { name: string; address: string } | null {
    return this.client;
  }

  public getRestaurant(): { name: string; address: string } | null {
    return this.restaurant;
  }

  public setRobotName(name: string | null): void {
    this.robotName = name;
  }

  public getRobotName(): string | null {
    return this.robotName;
  }

  public setStatus(status: OrderStatus): void {
    this.status = status;
  }

  public setRobotId(robotId: number | null): void {
    this.robotId = robotId;
  }

  public setCreatedAt(date: Date): void {
    this.createdAt = date;
  }

  public setCompletedAt(date: Date | null): void {
    this.completedAt = date;
  }

  public changeStatus(robot: Robot) {
    const currentState = STATE_MAP[this.status];
    currentState.next(this, robot);
  }
}
