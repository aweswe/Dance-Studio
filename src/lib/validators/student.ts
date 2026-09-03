import { z } from "zod";
import { indianPhoneSchema, optionalIndianPhoneSchema } from "./phone";

export const updateStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: optionalIndianPhoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  programmeId: z.string().uuid("Select a programme").nullable().optional(),
  batchId: z.string().uuid("Select a batch").nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type UpdateStudentData = z.infer<typeof updateStudentSchema>;

/** Walk-in enrolment (admin-side student creation). */
export const createStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: indianPhoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  programmeId: z.string().uuid("Select a programme").nullable().optional(),
  batchId: z.string().uuid("Select a batch").nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  enablePortal: z.boolean().optional(),
});

export type CreateStudentData = z.infer<typeof createStudentSchema>;
