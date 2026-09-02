import { z } from "zod";
import { normalizeIndianPhone } from "@/lib/utils/format";

export const enrolFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .transform((v) => normalizeIndianPhone(v))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  programmeId: z.string().uuid("Select a programme"),
  batchId: z.string().uuid("Select a batch"),
});

export type EnrolFormData = z.infer<typeof enrolFormSchema>;
