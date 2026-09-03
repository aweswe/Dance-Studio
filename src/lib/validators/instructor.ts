import { z } from "zod";
import { optionalIndianPhoneSchema } from "./phone";

export const createInstructorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  role: z.string().max(100, "Role is too long").optional(),
  bio: z.string().max(2000, "Bio is too long").optional(),
  certifications: z
    .array(z.string().min(1))
    .max(20, "Too many certifications")
    .default([]),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  phone: optionalIndianPhoneSchema,
  isActive: z.boolean().default(true),
});

export type CreateInstructorData = z.infer<typeof createInstructorSchema>;
