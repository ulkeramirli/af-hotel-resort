import { generateSignature } from "./signature";

const REQUEST_URL =
  process.env.EPOINT_REQUEST_URL || "https://epoint.az/api/1/request";

export async function createEpointPayment(payload: {
  amount: number;
  orderId: string;
  description: string;
  currency?: string;
  language?: string;
}) {
  const {
    EPOINT_PUBLIC_KEY,
    EPOINT_PRIVATE_KEY,
    EPOINT_SUCCESS_URL,
    EPOINT_ERROR_URL,
    EPOINT_RESULT_URL,
  } = process.env;

  if (!EPOINT_PUBLIC_KEY) {
    throw new Error("EPOINT_PUBLIC_KEY is missing");
  }

  if (!EPOINT_PRIVATE_KEY) {
    throw new Error("EPOINT_PRIVATE_KEY is missing");
  }

  if (!EPOINT_SUCCESS_URL) {
    throw new Error("EPOINT_SUCCESS_URL is missing");
  }

  if (!EPOINT_ERROR_URL) {
    throw new Error("EPOINT_ERROR_URL is missing");
  }

  const body: Record<string, any> = {
    public_key: EPOINT_PUBLIC_KEY,
    amount: payload.amount,
    currency: payload.currency === "USD" ? "USD" : "AZN",
    language: payload.language === "ru" ? "ru" : payload.language === "en" ? "en" : "az",
    order_id: payload.orderId,
    description: payload.description,
    success_redirect_url: EPOINT_SUCCESS_URL,
    error_redirect_url: EPOINT_ERROR_URL,
  };

  // Əgər Epoint request body-də result_url qəbul edirsə
  if (EPOINT_RESULT_URL) {
    body.result_url = EPOINT_RESULT_URL;
  }

  const data = Buffer.from(JSON.stringify(body)).toString("base64");

  const signature = generateSignature(data, EPOINT_PRIVATE_KEY);

  const form = new URLSearchParams({
    data,
    signature,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(REQUEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const rawResponse = await response.text();

    console.log("========== EPOINT RAW RESPONSE ==========");
    console.log(rawResponse);
    console.log("=========================================");

    if (!response.ok) {
      throw new Error(
        `Epoint request failed (${response.status}): ${rawResponse}`,
      );
    }

    let result;

    try {
      result = JSON.parse(rawResponse);
    } catch {
      throw new Error(`Epoint returned invalid JSON:\n${rawResponse}`);
    }

    console.log("========== EPOINT JSON RESPONSE ==========");
    console.log(result);
    console.log("==========================================");

    return result;
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Epoint request timeout");
    }

    throw error;
  }
}
