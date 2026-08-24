import { z } from "zod";

export const createProgrammeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  includes: z.array(z.string().min(1)).max(20, "Too many items").default([]),
  feesMonthly: z.coerce
    .number()
    .int("Monthly fee must be a whole number")
    .min(0, "Monthly fee cannot be negative"),
  feesQuarterly: z.coerce
    .number()
    .int("Quarterly fee must be a whole number")
    .min(0, "Quarterly fee cannot be negative"),
  ageGroup: z.string().max(50, "Age group is too long").optional(),
  isActive: z.boolean().default(true),
});

export type CreateProgrammeData = z.infer<typeof createProgrammeSchema>;
