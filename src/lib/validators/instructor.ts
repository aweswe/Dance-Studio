import { z } from "zod";

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
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type CreateInstructorData = z.infer<typeof createInstructorSchema>;
