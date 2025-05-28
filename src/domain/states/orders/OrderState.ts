import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";

export interface OrderState {
  next(order: Order, robot: Robot): void;
}
