import { z } from "zod";

export const otpLoginSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const otpVerifySchema = z.object({
  phone: z.string(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type OtpLoginData = z.infer<typeof otpLoginSchema>;
export type OtpVerifyData = z.infer<typeof otpVerifySchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
