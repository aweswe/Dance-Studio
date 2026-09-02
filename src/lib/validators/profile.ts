import { z } from "zod";
import { normalizeIndianPhone } from "@/lib/utils/format";

/** Student self-service profile edits from /student/profile. */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .transform((v) => normalizeIndianPhone(v))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
});

export type ProfileData = z.infer<typeof profileSchema>;
