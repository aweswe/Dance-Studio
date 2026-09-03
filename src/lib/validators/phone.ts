import { z } from "zod";
import { normalizeIndianPhone } from "@/lib/utils/format";

/**
 * Standard Indian phone validator.
 * Accepts:
 *   - 10-digit mobile: "9876543210"
 *   - +91 format: "+91 98765 43210", "+919876543210", "+91-98765-43210"
 *   - 0-prefixed: "09876543210", "0 98765 43210"
 *   - 91 prefix: "919876543210"
 * Automatically normalizes to standard 10-digit string for DB storage.
 */
export const indianPhoneSchema = z
  .string()
  .transform((v) => normalizeIndianPhone(v))
  .refine(
    (v) => /^[6-9]\d{9}$/.test(v),
    "Enter a valid 10-digit Indian mobile number (e.g. 9876543210, +91 9876543210, or 09876543210)"
  );

export const optionalIndianPhoneSchema = z
  .string()
  .transform((v) => normalizeIndianPhone(v))
  .refine(
    (v) => !v || /^[6-9]\d{9}$/.test(v),
    "Enter a valid 10-digit Indian mobile number (e.g. 9876543210, +91 9876543210, or 09876543210)"
  )
  .optional()
  .or(z.literal(""));
