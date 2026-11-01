"use client";

import { FormEvent, useState } from "react";
import { FadeIn, ModePill } from "@/components/ui";

type PaymentKind =
  | "freelance_service"
  | "prize_award"
  | "goods_sale"
  | "salary_contractor"
  | "donation"
  | "unknown";

export function SendClient() {
  const [recipientEmail, setRecipientEmail] = useState("recipient@example.com");
  const [recipientName, setRecipientName] = useState("Alex Recipient");
  const [amount, setAmount] = useState("2500");
  const [currency, setCurrency] = useState("USD");
  const [paymentKind, setPaymentKind] = useState<PaymentKind>("freelance_service");
  const [purpose, setPurpose] = useState(
    "Payment for completed freelance web development work — invoice attached.",
  );
  const [note, setNote] = useState(
    "Documented payout with invoice reference Clearhold-SAFE-PAY",
  );
  const [loading, setLoading] = useState<"invoice" | "payout" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invoiceResult, setInvoiceResult] = useState<Record<string, unknown> | null>(
    null,
  );
  const [payoutResult, setPayoutResult] = useState<Record<string, unknown> | null>(
    null,
  );
  const [statusResult, setStatusResult] = useState<Record<string, unknown> | null>(
    null,
  );

  const lineItem =
    paymentKind === "prize_award"
      ? "Contest / award payout"
      : paymentKind === "freelance_service"
        ? "Professional services rendered"
        : paymentKind === "salary_contractor"
          ? "Contractor compensation"
          : paymentKind === "donation"
            ? "Donation / grant disbursement"
            : paymentKind === "goods_sale"
              ? "Goods purchase"
              : "Documented payment";

  async function createInvoice(e?: FormEvent) {
    e?.preventDefault();
    setLoading("invoice");
    setError(null);
    try {
      const res = await fetch("/api/paypal/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          amount,
          currency,
          purpose,
          lineItem,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invoice failed");
      setInvoiceResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invoice failed");
    } finally {
      setLoading(null);
    }
  }

  async function createPayout() {
    setLoading("payout");
    setError(null);
    try {
      const res = await fetch("/api/paypal/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          amount,
          currency,
          purpose,
          note,
          paymentKind,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payout failed");
      setPayoutResult(data);
      setStatusResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payout failed");
    } finally {
      setLoading(null);
    }
  }

  async function checkStatus() {
    const batch =
      payoutResult &&
      typeof payoutResult === "object" &&
      payoutResult.batch_header &&
      typeof payoutResult.batch_header === "object"
        ? (payoutResult.batch_header as { payout_batch_id?: string }).payout_batch_id
        : undefined;
    if (!batch) return;
    setLoading("payout");
    try {
      const res = await fetch(`/api/paypal/status?batchId=${encodeURIComponent(batch)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status failed");
      setStatusResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <FadeIn>
        <form onSubmit={createInvoice} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Labeled
              label="Recipient email"
              value={recipientEmail}
              onChange={setRecipientEmail}
            />
            <Labeled
              label="Recipient name"
              value={recipientName}
              onChange={setRecipientName}
            />
            <Labeled label="Amount" value={amount} onChange={setAmount} />
            <Labeled label="Currency" value={currency} onChange={setCurrency} />
          </div>

          <div>
              <label className="mb-2 block text-[14px] font-medium text-[var(--ink)]">
              Payment type
            </label>
            <select
              className="field"
              value={paymentKind}
              onChange={(e) => setPaymentKind(e.target.value as PaymentKind)}
            >
              <option value="freelance_service">Freelance / services</option>
              <option value="prize_award">Prize / award</option>
              <option value="salary_contractor">Contractor pay</option>
              <option value="goods_sale">Goods sale</option>
              <option value="donation">Donation / grant</option>
              <option value="unknown">Other documented payment</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[var(--ink)]">
              Purpose (shown on docs / payout)
            </label>
            <textarea
              className="field"
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <Labeled label="Payout note" value={note} onChange={setNote} />

          {error ? (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading !== null}
            >
              {loading === "invoice" ? "Creating…" : "Create invoice pack"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={createPayout}
              disabled={loading !== null}
            >
              {loading === "payout" ? "Sending…" : "Send PayPal payout"}
            </button>
          </div>
        </form>
      </FadeIn>

      <div className="space-y-4">
        <FadeIn delay={80}>
          <div className="panel p-6">
            <h2
              className="text-[24px] leading-8 text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Why this reduces holds
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-[var(--ink-2)]">
              <li>Explicit purpose note instead of a blank transfer</li>
              <li>Invoice trail that matches amount and currency</li>
              <li>Payment kind labeled before money moves</li>
              <li>Status tracking after send</li>
            </ul>
          </div>
        </FadeIn>

        {invoiceResult ? (
          <FadeIn>
            <ResultPanel
              title="Invoice package"
              mode={String(invoiceResult.mode || "demo") as "demo" | "paypal"}
              body={invoiceResult}
            />
          </FadeIn>
        ) : null}

        {payoutResult ? (
          <FadeIn>
            <div className="space-y-3">
              <ResultPanel
                title="Payout"
                mode={String(payoutResult.mode || "demo") as "demo" | "paypal"}
                body={payoutResult}
              />
              <button type="button" className="btn-ghost" onClick={checkStatus}>
                Check payout status
              </button>
            </div>
          </FadeIn>
        ) : null}

        {statusResult ? (
          <FadeIn>
            <ResultPanel
              title="Status"
              mode={String(statusResult.mode || "demo") as "demo" | "paypal"}
              body={statusResult}
            />
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}

function Labeled({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[var(--ink)]">
        {label}
      </label>
      <input className="field" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ResultPanel({
  title,
  mode,
  body,
}: {
  title: string;
  mode: "demo" | "paypal" | "ai";
  body: Record<string, unknown>;
}) {
  return (
    <div className="panel p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-medium text-[var(--ink-3)]">{title}</h3>
        <ModePill mode={mode} />
      </div>
      <pre className="mono max-h-80 overflow-auto rounded-lg bg-[var(--bg)] p-3 text-[12px] leading-5 text-[var(--ink)]">
        {JSON.stringify(body, null, 2)}
      </pre>
    </div>
  );
}
