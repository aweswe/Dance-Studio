"use client";

import { useCallback, useRef } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface UseRazorpayOptions {
  onSuccess: (response: RazorpayResponse) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Hook to open Razorpay checkout modal.
 * Loads Razorpay script on demand.
 */
export function useRazorpay({ onSuccess, onError, onDismiss }: UseRazorpayOptions) {
  const scriptLoaded = useRef(false);

  const loadScript = useCallback((): Promise<void> => {
    if (scriptLoaded.current || typeof window.Razorpay !== "undefined") {
      scriptLoaded.current = true;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  }, []);

  const openCheckout = useCallback(
    async (params: {
      orderId: string;
      amount: number;
      currency?: string;
      description?: string;
      prefill?: { name?: string; email?: string; contact?: string };
    }) => {
      try {
        await loadScript();

        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: params.amount,
          currency: params.currency || "INR",
          name: "Rhythmzz Academy of Dance",
          description: params.description || "Dance Class Enrolment",
          order_id: params.orderId,
          prefill: params.prefill,
          theme: { color: "#2BB4D8" },
          handler: onSuccess,
          modal: { ondismiss: onDismiss },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        onError?.(error instanceof Error ? error.message : "Payment failed");
      }
    },
    [loadScript, onSuccess, onError, onDismiss],
  );

  return { openCheckout };
}
