import { z } from "zod";

/** Public contact-form enquiry. */
export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message is too long — keep it under 2000 characters"),
});

export type EnquiryData = z.infer<typeof enquirySchema>;
