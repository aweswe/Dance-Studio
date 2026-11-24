import { z } from "zod";
import { indianPhoneSchema, optionalIndianPhoneSchema } from "./phone";

/**
 * Student self-service profile edits from /student/profile.
 * Parent/guardian details are optional at the schema level and strictly
 * enforced for kids' classes via `kidsProfileSchema`.
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Student name is too long"),
  phone: indianPhoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  parentName: z
    .string()
    .max(100, "Parent or guardian name is too long")
    .optional()
    .or(z.literal("")),
  parentPhone: optionalIndianPhoneSchema,
  parentRelationship: z
    .string()
    .max(50, "Relationship is too long")
    .optional()
    .or(z.literal("")),
});

/** Strict profile validator when the student is enrolled in a kids' class. */
export const kidsProfileSchema = profileSchema.extend({
  parentName: z
    .string()
    .min(2, "Parent or guardian name is mandatory")
    .max(100, "Parent or guardian name is too long"),
  parentPhone: indianPhoneSchema,
  parentRelationship: z
    .string()
    .min(2, "Parent or guardian relationship is mandatory (e.g. Mother, Father, Guardian)")
    .max(50, "Relationship is too long"),
});

export type ProfileData = z.infer<typeof profileSchema>;
