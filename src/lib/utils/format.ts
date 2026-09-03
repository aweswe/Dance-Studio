/**
 * Format a number as Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, style: "short" | "long" | "relative" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (style === "relative") {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(d, "short");
  }

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

/**
 * Format time from HH:MM:SS to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

/**
 * Normalize Indian phone numbers: strips +91, leading 0, 91, 0091, spaces, dashes
 * and returns standard 10-digit mobile number if valid.
 */
export function normalizeIndianPhone(input?: string | null): string {
  if (!input) return "";
  let digits = String(input).replace(/\D/g, "");

  // Strip international prefix 0091 or 00
  if (digits.startsWith("0091")) digits = digits.slice(4);
  else if (digits.startsWith("00")) digits = digits.slice(2);

  // If 13 digits starting with 091 or 910
  if (digits.length === 13) {
    if (digits.startsWith("091")) digits = digits.slice(3);
    else if (digits.startsWith("910")) digits = digits.slice(3);
  }

  // If 12 digits starting with 91 (+91XXXXXXXXXX or 91XXXXXXXXXX)
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  // If 11 digits starting with 0 (0XXXXXXXXXX)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Fallback: If more than 10 digits and ends with a 10-digit valid Indian mobile number starting with 6-9
  if (digits.length > 10) {
    const last10 = digits.slice(-10);
    if (/^[6-9]/.test(last10)) {
      digits = last10;
    }
  }

  return digits;
}

export function isValidIndianPhone(input?: string | null): boolean {
  if (!input) return false;
  const digits = normalizeIndianPhone(input);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Format phone number for display
 */
export function formatPhone(phone?: string | null): string {
  if (!phone) return "—";
  const cleaned = normalizeIndianPhone(phone);
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return String(phone);
}

/**
 * Generate a WhatsApp link with pre-filled message
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/919052980859?text=${encodeURIComponent(message)}`;
}

/** Click-to-call tel: link for any Indian phone format. */
export function telLink(phone?: string | null): string {
  if (!phone) return "#";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `tel:+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `tel:+${digits}`;
  return digits ? `tel:${digits}` : "#";
}
