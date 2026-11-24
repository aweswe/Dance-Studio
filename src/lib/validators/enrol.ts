import { z } from "zod";
import { indianPhoneSchema } from "./phone";

export const enrolFormSchema = z.object({
  childName: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Name is too long"),
  parentName: z
    .string()
    .max(100, "Name is too long")
    .optional()
    .or(z.literal("")),
  age: z
    .string()
    .min(1, "Age is required")
    .max(10, "Age is too long"),
  phone: indianPhoneSchema,
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  programmeId: z.string().uuid("Select a programme"),
  batchId: z.string().uuid("Select a batch"),
});

export const kidsEnrolFormSchema = enrolFormSchema.extend({
  parentName: z
    .string()
    .min(2, "Parent / guardian name is required")
    .max(100, "Name is too long"),
});

export type EnrolFormData = z.infer<typeof enrolFormSchema>;
