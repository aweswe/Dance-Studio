import { z } from "zod";

export const updateStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  programmeId: z.string().uuid("Select a programme").nullable().optional(),
  batchId: z.string().uuid("Select a batch").nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type UpdateStudentData = z.infer<typeof updateStudentSchema>;
