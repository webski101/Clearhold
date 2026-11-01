export type HoldRiskLevel = "low" | "medium" | "high";

export type PaymentKind =
  | "freelance_service"
  | "prize_award"
  | "goods_sale"
  | "refund"
  | "family_friend"
  | "salary_contractor"
  | "donation"
  | "unknown";

export interface DiagnosisResult {
  summary: string;
  likelyCause: string;
  riskLevel: HoldRiskLevel;
  paymentKind: PaymentKind;
  confidence: number;
  checklist: string[];
  replyDraft: string;
  senderAdvice: string[];
  nextSteps: string[];
  invoiceOutline: {
    title: string;
    description: string;
    lineItem: string;
  };
}

export interface DiagnoseRequest {
  holdNotice: string;
  amount?: string;
  currency?: string;
  senderCountry?: string;
  recipientCountry?: string;
  relationship?: string;
  context?: string;
}

export interface SafePayoutRequest {
  recipientEmail: string;
  amount: string;
  currency: string;
  purpose: string;
  paymentKind: PaymentKind;
  note?: string;
  recipientName?: string;
}
