import type { DiagnosisResult, DiagnoseRequest } from "@/lib/types";

function detectKind(text: string): DiagnosisResult["paymentKind"] {
  const t = text.toLowerCase();
  if (/hackathon|prize|award|contest|bounty|grant/.test(t)) return "prize_award";
  if (/invoice|freelance|contract|consult|client|retainer/.test(t))
    return "freelance_service";
  if (/salary|payroll|w2|contractor|remote work/.test(t))
    return "salary_contractor";
  if (/refund|return|chargeback/.test(t)) return "refund";
  if (/donation|nonprofit|charity/.test(t)) return "donation";
  if (/goods|product|order|shop|merchandise/.test(t)) return "goods_sale";
  if (/family|friend|gift|personal/.test(t)) return "family_friend";
  return "unknown";
}

function riskFromSignals(req: DiagnoseRequest, kind: DiagnosisResult["paymentKind"]) {
  const text = `${req.holdNotice} ${req.context ?? ""}`.toLowerCase();
  let score = 0;
  if (/international|cross.?border|foreign|abroad|overseas/.test(text)) score += 2;
  if (req.senderCountry && req.recipientCountry && req.senderCountry !== req.recipientCountry)
    score += 2;
  if (/held|limited|review|verify|temporarily unavailable|security/.test(text)) score += 2;
  if (/first time|new account|unusual|large amount/.test(text)) score += 1;
  if (kind === "prize_award" || kind === "family_friend" || kind === "unknown") score += 1;
  if (score >= 5) return "high" as const;
  if (score >= 3) return "medium" as const;
  return "low" as const;
}

const KIND_LABEL: Record<DiagnosisResult["paymentKind"], string> = {
  freelance_service: "payment for freelance / professional services",
  prize_award: "a contest or award payout",
  goods_sale: "payment for goods sold",
  refund: "a refund",
  family_friend: "a personal transfer from family or friends",
  salary_contractor: "contractor / remote work compensation",
  donation: "a donation",
  unknown: "a legitimate inbound payment",
};

export function demoDiagnose(req: DiagnoseRequest): DiagnosisResult {
  const blob = `${req.holdNotice}\n${req.context ?? ""}`;
  const paymentKind = detectKind(blob);
  const riskLevel = riskFromSignals(req, paymentKind);
  const amount = req.amount ? `${req.currency ?? "USD"} ${req.amount}` : "the held amount";
  const corridor =
    req.senderCountry && req.recipientCountry
      ? `${req.senderCountry} → ${req.recipientCountry}`
      : "an international corridor";

  const checklist = [
    "Government-issued ID matching your PayPal account name",
    "Invoice or award letter stating amount, date, and purpose",
    "Proof of relationship with the sender (email thread, contract, event page)",
    "Delivery proof if applicable (work product, shipment, certificate)",
    "A clear written explanation of how you earned or were awarded the funds",
  ];

  if (paymentKind === "prize_award") {
    checklist.splice(1, 0, "Official winner announcement or project submission link");
  }
  if (paymentKind === "freelance_service") {
    checklist.splice(1, 0, "Signed contract or statement of work with milestones");
  }

  const replyDraft = `Hello PayPal Support,

I am writing regarding a temporary hold on an inbound payment of ${amount}. This payment is ${KIND_LABEL[paymentKind]}.

Context:
- Sender relationship: ${req.relationship || "documented business/event relationship"}
- Corridor: ${corridor}
- Purpose: ${req.context || "legitimate payment for documented work or award"}

I can provide:
1. An invoice / award letter matching the payment amount and date
2. Communication with the sender confirming the payment purpose
3. Identity documents matching my PayPal profile
4. Evidence of the underlying work, sale, or award

Please let me know if any additional documents are required. I am happy to cooperate so the funds can be released.

Thank you,
[Your full legal name]
[PayPal email on the account]
[Case / transaction ID if available]`;

  return {
    summary:
      riskLevel === "high"
        ? "This looks like a cross-border compliance review. Clear documentation usually unlocks it — not silence."
        : "PayPal is asking for source-of-funds clarity. A tight document pack and reply should move this forward.",
    likelyCause:
      paymentKind === "prize_award"
        ? "Award payouts often lack an invoice trail, so international transfers trigger manual review."
        : paymentKind === "freelance_service"
          ? "Service payments without a clear invoice memo or prior sending history can be flagged on first receipt."
          : "Inbound funds without an obvious goods/services trail commonly trigger temporary holds, especially internationally.",
    riskLevel,
    paymentKind,
    confidence: paymentKind === "unknown" ? 0.62 : 0.86,
    checklist,
    replyDraft,
    senderAdvice: [
      "Send via invoice or PayPal Payouts with an explicit purpose note — not a blank personal transfer.",
      "Match the amount and currency to the invoice / award letter exactly.",
      "Include the recipient's legal name and a short description of the work or award in the payment note.",
      "Ask the recipient to confirm their account is verified before sending large first-time amounts.",
    ],
    nextSteps: [
      "Generate or attach the invoice / award pack below",
      "Paste the reply draft into your PayPal case (edit names and IDs)",
      "Upload ID + proof in one batch — avoid drip-feeding documents over days",
      "Save the case number and check status daily until released",
    ],
    invoiceOutline: {
      title:
        paymentKind === "prize_award"
          ? "Prize Award Disbursement"
          : paymentKind === "freelance_service"
            ? "Professional Services Invoice"
            : "Payment Documentation",
      description:
        paymentKind === "prize_award"
          ? "Official disbursement for contest/award winnings with source-of-funds context."
          : "Documentation package describing the legitimate purpose of this PayPal payment.",
      lineItem:
        paymentKind === "prize_award"
          ? "Contest / award payout"
          : paymentKind === "freelance_service"
            ? "Professional services rendered"
            : "Documented payment obligation",
    },
  };
}
