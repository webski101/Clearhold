import { NextResponse } from "next/server";
import {
  demoInvoiceResponse,
  paypalConfigured,
  paypalFetch,
} from "@/lib/paypal/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      recipientName,
      amount,
      currency = "USD",
      purpose,
      lineItem,
    } = body as {
      recipientEmail?: string;
      recipientName?: string;
      amount?: string;
      currency?: string;
      purpose?: string;
      lineItem?: string;
    };

    if (!recipientEmail || !amount || !purpose) {
      return NextResponse.json(
        { error: "recipientEmail, amount, and purpose are required" },
        { status: 400 },
      );
    }

    const itemName = lineItem || purpose;

    if (!paypalConfigured()) {
      return NextResponse.json(
        demoInvoiceResponse({
          recipientEmail,
          recipientName,
          amount,
          currency,
          purpose,
          lineItem: itemName,
        }),
      );
    }

    const invoice = await paypalFetch<Record<string, unknown>>("/v2/invoicing/invoices", {
      method: "POST",
      body: JSON.stringify({
        detail: {
          invoice_number: `CH-${Date.now()}`,
          currency_code: currency,
          note: purpose,
          payment_term: { term_type: "DUE_ON_RECEIPT" },
        },
        primary_recipients: [
          {
            billing_info: {
              email_address: recipientEmail,
              name: recipientName
                ? { full_name: recipientName }
                : undefined,
            },
          },
        ],
        items: [
          {
            name: itemName,
            quantity: "1",
            unit_amount: { currency_code: currency, value: amount },
          },
        ],
        configuration: {
          allow_tip: false,
          tax_calculated_after_discount: true,
        },
      }),
    });

    return NextResponse.json({ mode: "paypal", ...invoice });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invoice creation failed",
      },
      { status: 500 },
    );
  }
}
