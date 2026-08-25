"use client";

/** Load the Razorpay checkout script once; resolves false on failure. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CheckoutOptions {
  orderId: string;
  amount: number; // rupees
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: () => void;
  onFailure: (message: string) => void;
  onDismiss?: () => void;
}

/**
 * Open the Razorpay checkout and POST the payment response to
 * /api/razorpay/verify, which validates the signature and fulfils the order.
 */
export function openRazorpayCheckout(opts: CheckoutOptions): void {
  const rzp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: opts.amount * 100, // paise
    currency: "INR",
    name: "Rhythmzz Academy of Dance",
    description: opts.description,
    order_id: opts.orderId,
    prefill: opts.prefill,
    theme: { color: "#2BB4D8" },
    modal: {
      ondismiss: () => opts.onDismiss?.(),
    },
    handler: async (response: RazorpayResponse) => {
      try {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        if (verifyRes.ok) {
          opts.onSuccess();
        } else {
          opts.onFailure(
            "Your payment was received but verification failed. Please message us on WhatsApp — we will confirm your enrolment manually.",
          );
        }
      } catch {
        opts.onFailure("Could not verify the payment. Please message us on WhatsApp to confirm.");
      }
    },
  });

  rzp.on("payment.failed", () => {
    opts.onFailure("Payment didn't go through. You can try again.");
  });

  rzp.open();
}
