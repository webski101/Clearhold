const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

export function paypalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal auth failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function paypalFetch<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const token = init.accessToken ?? (await getPayPalAccessToken());
  const { accessToken: _ignored, ...rest } = init;
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(rest.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(
      `PayPal API ${path} failed: ${res.status} ${JSON.stringify(data)}`,
    );
  }
  return data as T;
}

export function demoPayoutResponse(input: {
  recipientEmail: string;
  amount: string;
  currency: string;
  purpose: string;
}) {
  const batchId = `DEMO-BATCH-${Date.now()}`;
  return {
    mode: "demo" as const,
    batch_header: {
      payout_batch_id: batchId,
      batch_status: "PENDING",
      time_created: new Date().toISOString(),
    },
    items: [
      {
        payout_item_id: `DEMO-ITEM-${Date.now()}`,
        transaction_status: "PENDING",
        payout_item: {
          receiver: input.recipientEmail,
          amount: { value: input.amount, currency: input.currency },
          note: input.purpose,
        },
      },
    ],
    clearhold: {
      message:
        "Demo payout created locally. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to send a real sandbox payout.",
      holdPreventionTips: [
        "Purpose note attached to payout item",
        "Amount and currency explicit",
        "Recipient email captured for audit trail",
      ],
    },
  };
}

export function demoInvoiceResponse(input: {
  recipientEmail: string;
  recipientName?: string;
  amount: string;
  currency: string;
  purpose: string;
  lineItem: string;
}) {
  const id = `DEMO-INV-${Date.now()}`;
  return {
    mode: "demo" as const,
    id,
    status: "DRAFT",
    detail: {
      invoice_number: id,
      currency_code: input.currency,
      note: input.purpose,
    },
    primary_recipients: [
      {
        billing_info: {
          email_address: input.recipientEmail,
          name: { full_name: input.recipientName || "Recipient" },
        },
      },
    ],
    items: [
      {
        name: input.lineItem,
        quantity: "1",
        unit_amount: { currency_code: input.currency, value: input.amount },
      },
    ],
    clearhold: {
      message:
        "Demo invoice package created. Connect PayPal sandbox credentials to create a real draft invoice.",
    },
  };
}
