import { NextResponse } from "next/server";
import { diagnoseHold } from "@/lib/ai/diagnose";
import { demoDiagnose } from "@/lib/ai/demo-diagnose";
import type { DiagnoseRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiagnoseRequest & {
      forceDemo?: boolean;
    };
    if (!body.holdNotice || body.holdNotice.trim().length < 10) {
      return NextResponse.json(
        { error: "Paste the hold notice or case text (at least a sentence)." },
        { status: 400 },
      );
    }

    if (body.forceDemo) {
      return NextResponse.json({
        result: demoDiagnose(body),
        mode: "demo",
      });
    }

    const { result, mode, fallbackReason } = await diagnoseHold(body);
    return NextResponse.json({
      result,
      mode,
      ...(fallbackReason ? { fallbackReason } : {}),
    });
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
