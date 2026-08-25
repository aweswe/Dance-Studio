/**
 * Provider-agnostic WhatsApp API client.
 * Supports WATI and Interakt via environment variable WHATSAPP_PROVIDER.
 */

interface SendTemplateParams {
  phone: string;
  templateName: string;
  variables: Record<string, string>;
}

interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * Send a WhatsApp template message to a phone number.
 */
export async function sendWhatsAppTemplate(
  params: SendTemplateParams,
): Promise<SendResult> {
  const provider = process.env.WHATSAPP_PROVIDER || "interakt";

  // No API key configured → mock mode: log and report success so callers
  // (queue drain, enrolment welcome, fee reminders) behave end-to-end.
  if (!process.env.WHATSAPP_API_KEY) {
    console.log("[WhatsApp Mock]", provider, params.templateName, params.phone);
    return { success: true };
  }

  try {
    if (provider === "interakt") {
      return await sendViaInterakt(params);
    } else if (provider === "wati") {
      return await sendViaWati(params);
    } else {
      console.warn(`Unknown WhatsApp provider: ${provider}. Logging message.`);
      console.log("[WhatsApp Mock]", params);
      return { success: true };
    }
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

  // Normalize phone: remove +, ensure 91 prefix
  const phone = params.phone.replace(/\D/g, "").replace(/^(\+?91)?/, "91");

  const bodyValues = Object.values(params.variables);

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
  });

  if (!response.ok) {
    const text = await response.text();
    return { success: false, error: `Interakt API error: ${response.status} ${text}` };
  }

  return { success: true };
}

async function sendViaWati(params: SendTemplateParams): Promise<SendResult> {
  const apiKey = process.env.WHATSAPP_API_KEY!;
  const apiUrl = process.env.WHATSAPP_API_URL!;

  const phone = params.phone.replace(/\D/g, "").replace(/^(\+?91)?/, "91");

  const watiParams = Object.entries(params.variables).map(([name, value]) => ({
    name,
    value,
  }));

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
    },
  );

  if (!response.ok) {
    const text = await response.text();
    return { success: false, error: `WATI API error: ${response.status} ${text}` };
  }

  return { success: true };
}
