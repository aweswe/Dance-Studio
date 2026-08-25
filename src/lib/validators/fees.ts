import { z } from "zod";

export const logOfflinePaymentSchema = z.object({
  studentId: z.string().uuid("Select a student"),
  amount: z.coerce
    .number()
    .int("Amount must be a whole number")
    .min(1, "Amount must be at least ₹1"),
  source: z.enum(["cash", "upi_offline"], {
    message: "Pick a payment source",
  }),
  notes: z.string().max(500, "Notes are too long").optional().or(z.literal("")),
  forMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Pick a valid month")
    .optional(),
});

export type LogOfflinePaymentData = z.infer<typeof logOfflinePaymentSchema>;
