import { z } from "zod";

export const sendBroadcastSchema = z
  .object({
    scope: z.enum(["all", "programme", "batch"], { message: "Pick a scope" }),
    scopeId: z.string().uuid("Pick the target for this scope").optional().or(z.literal("")),
    message: z
      .string()
      .min(1, "Message is required")
      .max(1000, "Message is too long (max 1000 characters)"),
  })
  .refine((d) => d.scope === "all" || !!d.scopeId, {
    message: "Pick the target for this scope",
    path: ["scopeId"],
  });

export type SendBroadcastData = z.infer<typeof sendBroadcastSchema>;
