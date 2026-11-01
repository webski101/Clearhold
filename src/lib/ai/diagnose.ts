import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { DiagnosisResult, DiagnoseRequest } from "@/lib/types";
import { demoDiagnose } from "@/lib/ai/demo-diagnose";

const diagnosisSchema = z.object({
  summary: z.string(),
  likelyCause: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  paymentKind: z.enum([
    "freelance_service",
    "prize_award",
    "goods_sale",
    "refund",
    "family_friend",
    "salary_contractor",
    "donation",
    "unknown",
  ]),
  confidence: z.number().min(0).max(1),
  checklist: z.array(z.string()).min(3).max(8),
  replyDraft: z.string(),
  senderAdvice: z.array(z.string()).min(2).max(6),
  nextSteps: z.array(z.string()).min(3).max(6),
  invoiceOutline: z.object({
    title: z.string(),
    description: z.string(),
    lineItem: z.string(),
  }),
});

function hasAiCredentials() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

export async function diagnoseHold(
  req: DiagnoseRequest,
): Promise<{ result: DiagnosisResult; mode: "ai" | "demo" }> {
  if (!hasAiCredentials()) {
    return { result: demoDiagnose(req), mode: "demo" };
  }

  try {
    const prompt = `You help people resolve PayPal payment holds and limitations — especially international inbound payments.

Never suggest fraud, fake documents, or bypassing compliance. Focus on legitimate documentation, clear explanations, and better sender practices.

User inputs:
- Hold notice / case text: ${req.holdNotice}
- Amount: ${req.amount ?? "unknown"}
- Currency: ${req.currency ?? "unknown"}
- Sender country: ${req.senderCountry ?? "unknown"}
- Recipient country: ${req.recipientCountry ?? "unknown"}
- Relationship: ${req.relationship ?? "unknown"}
- Extra context: ${req.context ?? "none"}

Return a practical diagnosis with:
1) short summary
2) likely cause
3) risk level
4) payment kind classification
5) confidence 0-1
6) document checklist
7) a ready-to-send PayPal support reply draft with placeholders in [brackets]
8) advice for future senders to reduce holds
9) next steps for the recipient
10) invoice outline fields for documentation`;

    const { output } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      output: Output.object({ schema: diagnosisSchema }),
      prompt,
    });

    if (!output) {
      return { result: demoDiagnose(req), mode: "demo" };
    }

    return { result: output, mode: "ai" };
  } catch {
    return { result: demoDiagnose(req), mode: "demo" };
  }
}
