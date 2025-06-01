import { z } from "zod";

export const robotSchema = z.object({
  status: z.enum(["offline", "busy", "available"]),
});

export type RobotAPI = z.infer<typeof robotSchema>;
