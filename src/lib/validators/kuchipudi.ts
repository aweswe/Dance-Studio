import { z } from "zod";
import { KUCHIPUDI_LEVELS, isKnownModule } from "@/lib/kuchipudi/curriculum";

export const updateProgressSchema = z.object({
  studentId: z.string().uuid("Invalid student"),
  level: z
    .string()
    .refine((v) => (KUCHIPUDI_LEVELS as readonly string[]).includes(v), {
      message: "Unknown level",
    }),
  modules: z
    .array(z.string())
    .max(12, "Too many modules")
    .refine((arr) => arr.every(isKnownModule), {
      message: "Unknown module in list",
    }),
});

export type UpdateProgressData = z.infer<typeof updateProgressSchema>;
