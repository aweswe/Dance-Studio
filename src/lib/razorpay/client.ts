import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

/**
 * Lazily create the Razorpay server client.
 * Returns null when env keys are missing so callers can degrade gracefully
 * instead of constructing Razorpay with undefined credentials.
 */
export function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}
