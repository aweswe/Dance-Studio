import { z } from "zod";
import { indianPhoneSchema } from "./phone";

/** Student self-service profile edits from /student/profile. */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: indianPhoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
});

export type ProfileData = z.infer<typeof profileSchema>;
