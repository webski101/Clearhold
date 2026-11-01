import { NextResponse } from "next/server";
import { diagnoseHold } from "@/lib/ai/diagnose";
import type { DiagnoseRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiagnoseRequest;
    if (!body.holdNotice || body.holdNotice.trim().length < 10) {
      return NextResponse.json(
        { error: "Paste the hold notice or case text (at least a sentence)." },
        { status: 400 },
      );
    }

    const { result, mode } = await diagnoseHold(body);
    return NextResponse.json({ result, mode });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to diagnose hold",
      },
      { status: 500 },
    );
  }
}
