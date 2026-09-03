import { z } from "zod";
import { indianPhoneSchema } from "./phone";

/** Public contact-form enquiry. */
export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: indianPhoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message is too long — keep it under 2000 characters"),
});

export type EnquiryData = z.infer<typeof enquirySchema>;
