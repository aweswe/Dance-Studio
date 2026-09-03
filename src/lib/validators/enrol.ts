import { z } from "zod";
import { indianPhoneSchema } from "./phone";

export const enrolFormSchema = z.object({
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
  programmeId: z.string().uuid("Select a programme"),
  batchId: z.string().uuid("Select a batch"),
});

export type EnrolFormData = z.infer<typeof enrolFormSchema>;
