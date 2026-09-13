/**
 * Provider-agnostic WhatsApp API client.
 * Supports WATI and Interakt via environment variable WHATSAPP_PROVIDER.
 */

interface SendTemplateParams {
  phone: string;
  templateName: string;
  variables: Record<string, string>;
}

export interface SendResult {
  success: boolean;
  mocked?: boolean;
  error?: string;
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_API_KEY);
}

/**
 * Send a WhatsApp template message to a phone number.
 * When no API key is set, returns mocked: true and success: false so
 * callers cannot pretend the parent was messaged.
 */
export async function sendWhatsAppTemplate(
  params: SendTemplateParams,
): Promise<SendResult> {
  const provider = process.env.WHATSAPP_PROVIDER || "interakt";

  if (!process.env.WHATSAPP_API_KEY) {
    console.log("[WhatsApp Mock]", provider, params.templateName, params.phone);
    return {
      success: false,
      mocked: true,
      error: "TEST MODE: WhatsApp is not configured — message logged, not sent",
    };
  }

  try {
    if (provider === "interakt") {
      return await sendViaInterakt(params);
    }
    if (provider === "wati") {
      return await sendViaWati(params);
    }
    console.warn(`Unknown WhatsApp provider: ${provider}. Logging message.`);
    return {
      success: false,
      mocked: true,
      error: `Unknown WhatsApp provider: ${provider}`,
    };
  } catch (error) {
    console.error("[WhatsApp Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendViaInterakt(params: SendTemplateParams): Promise<SendResult> {
  const apiKey = process.env.WHATSAPP_API_KEY!;
  const apiUrl = process.env.WHATSAPP_API_URL || "https://api.interakt.ai/v1/public/message/";
  const phone = params.phone.replace(/\D/g, "").replace(/^(\+?91)?/, "91");
  const bodyValues = Object.values(params.variables);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: phone,
        type: "template",
        template: {
          name: params.templateName,
          languageCode: "en",
          bodyValues,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Interakt API error: ${response.status} ${text}` };
    }
    return { success: true };
  } finally {
    clearTimeout(timer);
  }
}

async function sendViaWati(params: SendTemplateParams): Promise<SendResult> {
  const apiKey = process.env.WHATSAPP_API_KEY!;
  const apiUrl = process.env.WHATSAPP_API_URL!;
  const phone = params.phone.replace(/\D/g, "").replace(/^(\+?91)?/, "91");
  const watiParams = Object.entries(params.variables).map(([name, value]) => ({
    name,
    value,
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(
      `${apiUrl}/api/v2/sendTemplateMessage?whatsappNumber=${phone}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_name: params.templateName,
          broadcast_name: `auto_${Date.now()}`,
          parameters: watiParams,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `WATI API error: ${response.status} ${text}` };
    }
    return { success: true };
  } finally {
    clearTimeout(timer);
  }
}
