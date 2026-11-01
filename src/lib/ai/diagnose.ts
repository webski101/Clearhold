import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { google } from "@ai-sdk/google";
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

type ModelRunner = { id: string; model: Parameters<typeof generateText>[0]["model"] };

function buildPrompt(req: DiagnoseRequest) {
  return `You help people resolve PayPal payment holds and limitations — especially international inbound payments.

Never suggest fraud, fake documents, or bypassing compliance. Focus on legitimate documentation, clear explanations, and better sender practices.

User inputs:
- Hold notice / case text: ${req.holdNotice}
- Amount: ${req.amount ?? "unknown"}
- Currency: ${req.currency ?? "unknown"}
- Sender country: ${req.senderCountry ?? "unknown"}
- Recipient country: ${req.recipientCountry ?? "unknown"}
- Relationship: ${req.relationship ?? "unknown"}
- Extra context: ${req.context ?? "none"}

Respond with ONLY valid JSON matching this shape:
{
  "summary": string,
  "likelyCause": string,
  "riskLevel": "low" | "medium" | "high",
  "paymentKind": "freelance_service" | "prize_award" | "goods_sale" | "refund" | "family_friend" | "salary_contractor" | "donation" | "unknown",
  "confidence": number between 0 and 1,
  "checklist": string[],
  "replyDraft": string,
  "senderAdvice": string[],
  "nextSteps": string[],
  "invoiceOutline": { "title": string, "description": string, "lineItem": string }
}`;
}

function parseJsonResult(text: string): DiagnosisResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = diagnosisSchema.safeParse(JSON.parse(match[0]));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function freeModels(): ModelRunner[] {
  const models: ModelRunner[] = [];

  // Google AI Studio free tier — no credit card required in most regions.
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    models.push({
      id: "google/gemini-flash",
      model: google(process.env.GOOGLE_MODEL || "gemini-3.8-flash"),
    });
  }

  // Vercel AI Gateway free models — needs a card on the Vercel team (charges stay $0).
  if (
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL
  ) {
    for (const id of [
      process.env.AI_MODEL,
      "nvidia/nemotron-3.5-lightning-free",
      "reflection/beam-free",
    ].filter(Boolean) as string[]) {
      models.push({ id, model: gateway(id) });
    }
  }

  return models;
}

export async function diagnoseHold(
  req: DiagnoseRequest,
): Promise<{
  result: DiagnosisResult;
  mode: "ai" | "demo";
  fallbackReason?: string;
}> {
  const models = freeModels();
  if (models.length === 0) {
    return {
      result: demoDiagnose(req),
      mode: "demo",
      fallbackReason:
        "Add a free Google AI Studio key (GOOGLE_GENERATIVE_AI_API_KEY) or unlock Vercel AI Gateway free models",
    };
  }

  const prompt = buildPrompt(req);
  const errors: string[] = [];

  for (const { id, model } of models) {
    try {
      const structured = await generateText({
        model,
        output: Output.object({ schema: diagnosisSchema }),
        prompt,
      });
      if (structured.output) {
        return { result: structured.output, mode: "ai" };
      }
      errors.push(`${id}: structured output empty`);
    } catch (error) {
      errors.push(
        `${id} structured: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    try {
      const plain = await generateText({ model, prompt });
      const parsed = parseJsonResult(plain.text);
      if (parsed) {
        return { result: parsed, mode: "ai" };
      }
      errors.push(`${id}: plain JSON parse failed`);
    } catch (error) {
      errors.push(
        `${id} plain: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.error("[clearhold] free AI fallback", errors.join(" | "));
  return {
    result: demoDiagnose(req),
    mode: "demo",
    fallbackReason: errors[0] || "Free AI models unavailable",
  };
}
