import { z } from "zod";

export const orderItemSchema = z.object({
  description: z.string().min(1),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid Price Format"),
  quantity: z.number().int().min(1),
});

export const orderSchema = z.object({
  clientId: z.number().int().min(1),
  restaurantId: z.number().int().min(1),
  items: z.array(orderItemSchema).min(1),
});

export const orderFilterSchema = z.object({
  client: z.string().optional(),
  restaurant: z.string().optional(),
  status: z
    .enum(["pending", "assigned", "picked_up", "delivered", "completed"])
    .optional(),
  robot: z.string().optional(),
});

export type OrderAPI = z.infer<typeof orderSchema>;
export type OrderAPIFilter = z.infer<typeof orderFilterSchema>;
