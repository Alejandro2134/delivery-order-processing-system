import { z } from "zod";

export const robotSchema = z.object({
  status: z.enum(["offline", "busy", "available"]),
});

export const robotFilterSchema = z.object({
  robot: z.string().optional(),
  status: z.enum(["offline", "busy", "available"]).optional(),
  lastKnownLocation: z.string().optional(),
});

export type RobotAPI = z.infer<typeof robotSchema>;
export type RobotAPIFilter = z.infer<typeof robotFilterSchema>;
