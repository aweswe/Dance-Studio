import { z } from "zod";
import { indianPhoneSchema } from "./phone";

export const rentalFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: indianPhoneSchema,
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  preferredDate: z.string().min(1, "Select a preferred date"),
  preferredTimeStart: z.string().min(1, "Select start time"),
  preferredTimeEnd: z.string().min(1, "Select end time"),
});

export type RentalFormData = z.infer<typeof rentalFormSchema>;
