import { z } from "zod";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createBatchSchema = z
  .object({
    programmeId: z.string().uuid("Select a programme"),
    instructorId: z.string().uuid("Select an instructor"),
    name: z
      .string()
      .min(2, "Batch name must be at least 2 characters")
      .max(120, "Batch name is too long"),
    days: z.array(z.string().min(1)).min(1, "Pick at least one day"),
    timeStart: z.string().regex(HHMM, "Use HH:MM (24-hour)"),
    timeEnd: z.string().regex(HHMM, "Use HH:MM (24-hour)"),
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1")
      .max(200, "Capacity cannot exceed 200"),
    status: z.enum(["active", "paused", "full"]).default("active"),
  })
  .refine((d) => d.timeEnd > d.timeStart, {
    message: "End time must be after start time",
    path: ["timeEnd"],
  });

export type CreateBatchData = z.infer<typeof createBatchSchema>;

export const updateBatchSchema = z
  .object({
    programmeId: z.string().uuid("Select a programme").optional(),
    instructorId: z.string().uuid("Select an instructor").nullable().optional().or(z.literal('')),
    name: z
      .string()
      .min(2, "Batch name must be at least 2 characters")
      .max(120, "Batch name is too long")
      .optional(),
    days: z.array(z.string().min(1)).min(1, "Pick at least one day").optional(),
    timeStart: z.string().regex(HHMM, "Use HH:MM (24-hour)").optional(),
    timeEnd: z.string().regex(HHMM, "Use HH:MM (24-hour)").optional(),
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1")
      .max(200, "Capacity cannot exceed 200")
      .optional(),
    status: z.enum(["active", "paused", "full"]).optional(),
  })
  .refine(
    (d) => {
      if (d.timeStart && d.timeEnd) {
        return d.timeEnd > d.timeStart;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["timeEnd"],
    }
  );

export type UpdateBatchData = z.infer<typeof updateBatchSchema>;
