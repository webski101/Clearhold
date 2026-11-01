import { NextResponse } from "next/server";
import { paypalConfigured, paypalFetch } from "@/lib/paypal/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get("batchId");

  if (!batchId) {
    return NextResponse.json({ error: "batchId is required" }, { status: 400 });
  }

  if (batchId.startsWith("DEMO-") || !paypalConfigured()) {
    return NextResponse.json({
      mode: "demo",
      batch_header: {
        payout_batch_id: batchId,
        batch_status: "SUCCESS",
        time_completed: new Date().toISOString(),
      },
      clearhold: {
        timeline: [
          { label: "Sent", done: true },
          { label: "Pending", done: true },
          { label: "Held / review", done: false },
          { label: "Available", done: true },
        ],
      },
    });
  }

  try {
    const details = await paypalFetch<Record<string, unknown>>(
      `/v1/payments/payouts/${batchId}`,
    );
    return NextResponse.json({ mode: "paypal", ...details });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Status lookup failed",
      },
      { status: 500 },
    );
  }
}
