import { NextResponse } from "next/server";
import {
  demoPayoutResponse,
  paypalConfigured,
  paypalFetch,
} from "@/lib/paypal/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      amount,
      currency = "USD",
      purpose,
      note,
    } = body as {
      recipientEmail?: string;
      amount?: string;
      currency?: string;
      purpose?: string;
      note?: string;
    };

    if (!recipientEmail || !amount || !purpose) {
      return NextResponse.json(
        { error: "recipientEmail, amount, and purpose are required" },
        { status: 400 },
      );
    }

    if (!paypalConfigured()) {
      return NextResponse.json(
        demoPayoutResponse({
          recipientEmail,
          amount,
          currency,
          purpose: note || purpose,
        }),
      );
    }

    const senderBatchId = `clearhold-${Date.now()}`;
    const payout = await paypalFetch<Record<string, unknown>>(
      "/v1/payments/payouts",
      {
        method: "POST",
        body: JSON.stringify({
          sender_batch_header: {
            sender_batch_id: senderBatchId,
            email_subject: "Clearhold documented payout",
            email_message: purpose,
          },
          items: [
            {
              recipient_type: "EMAIL",
              amount: { value: amount, currency },
              receiver: recipientEmail,
              note: note || purpose,
              sender_item_id: `item-${Date.now()}`,
            },
          ],
        }),
      },
    );

    return NextResponse.json({ mode: "paypal", ...payout });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Payout failed",
      },
      { status: 500 },
    );
  }
}
