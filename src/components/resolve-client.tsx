"use client";

import { FormEvent, useState, type ReactNode } from "react";
import type { DiagnosisResult } from "@/lib/types";
import { FadeIn, ModePill, RiskBadge } from "@/components/ui";

const SAMPLE_NOTICE = `Your PayPal payment of $2,500.00 USD from an international sender is temporarily held for review.
Please explain how you received this money and provide supporting documents.
Transaction appears unusual for your account activity.`;

export function ResolveClient() {
  const [holdNotice, setHoldNotice] = useState(SAMPLE_NOTICE);
  const [amount, setAmount] = useState("2500");
  const [currency, setCurrency] = useState("USD");
  const [senderCountry, setSenderCountry] = useState("United States");
  const [recipientCountry, setRecipientCountry] = useState("Nigeria");
  const [relationship, setRelationship] = useState("Client / payer");
  const [context, setContext] = useState(
    "I received an international PayPal payment for work I completed. The funds are held pending review.",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"ai" | "demo" | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holdNotice,
          amount,
          currency,
          senderCountry,
          recipientCountry,
          relationship,
          context,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Diagnosis failed");
      setResult(data.result);
      setMode(data.mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyReply() {
    if (!result) return;
    await navigator.clipboard.writeText(result.replyDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <FadeIn>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
              <label className="mb-2 block text-[14px] font-medium text-[var(--ink)]">
              Hold notice / case text
            </label>
            <textarea
              value={holdNotice}
              onChange={(e) => setHoldNotice(e.target.value)}
              rows={7}
              className="field min-h-40"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount" value={amount} onChange={setAmount} />
            <Field label="Currency" value={currency} onChange={setCurrency} />
            <Field
              label="Sender country"
              value={senderCountry}
              onChange={setSenderCountry}
            />
            <Field
              label="Your country"
              value={recipientCountry}
              onChange={setRecipientCountry}
            />
          </div>

          <Field
            label="Relationship to sender"
            value={relationship}
            onChange={setRelationship}
          />
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[var(--ink)]">
              Extra context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="field"
            />
          </div>

          {error ? (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {error}
            </p>
          ) : null}

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
            {loading ? "Diagnosing…" : "Diagnose hold"}
          </button>
        </form>
      </FadeIn>

      <div className="space-y-4">
        {!result ? (
          <FadeIn delay={120}>
            <div className="panel p-6 text-[var(--ink-2)]">
              <p
                className="text-[24px] leading-8 text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                What you get
              </p>
              <ul className="mt-4 space-y-3 text-[14px] leading-6">
                <li>Likely cause of the hold</li>
                <li>Document checklist for the payment type</li>
                <li>Ready-to-send PayPal reply draft</li>
                <li>Advice so future senders reduce the same delay</li>
              </ul>
            </div>
          </FadeIn>
        ) : (
          <FadeIn key={result.summary}>
            <div className="panel space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge level={result.riskLevel} />
                {mode ? <ModePill mode={mode} /> : null}
                <span className="mono text-[12px] text-[var(--ink-3)]">
                  {Math.round(result.confidence * 100)}% ·{" "}
                  {result.paymentKind.replaceAll("_", " ")}
                </span>
              </div>
              <div>
                <h2
                  className="text-[24px] leading-8 text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  {result.summary}
                </h2>
                <p className="mt-2 text-[14px] leading-6 text-[var(--ink-2)]">
                  {result.likelyCause}
                </p>
              </div>

              <Section title="Next steps">
                <ol className="list-decimal space-y-2 pl-5 text-[14px] leading-6 text-[var(--ink)]">
                  {result.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Section>

              <Section title="Document checklist">
                <ul className="space-y-2 text-sm">
                  {result.checklist.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--held)]" />
                      <span className="text-[14px] leading-6 text-[var(--ink)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section
                title="Reply draft"
                action={
                  <button type="button" onClick={copyReply} className="btn-ghost text-xs">
                    {copied ? "Copied" : "Copy"}
                  </button>
                }
              >
                <pre className="whitespace-pre-wrap rounded-lg bg-[var(--bg)] p-3 text-[12px] leading-5 text-[var(--ink)]">
                  {result.replyDraft}
                </pre>
              </Section>

              <Section title="Invoice / award outline">
                <p className="text-[14px] font-medium text-[var(--ink)]">
                  {result.invoiceOutline.title}
                </p>
                <p className="mt-1 text-[14px] leading-6 text-[var(--ink-2)]">
                  {result.invoiceOutline.description}
                </p>
                <p className="mt-2 text-[14px] text-[var(--ink)]">
                  Line item: {result.invoiceOutline.lineItem}
                </p>
              </Section>

              <Section title="Tell future senders">
                <ul className="space-y-2 text-[14px] leading-6 text-[var(--ink-2)]">
                  {result.senderAdvice.map((tip) => (
                    <li key={tip}>• {tip}</li>
                  ))}
                </ul>
              </Section>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

function Field({
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
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="border-t border-[var(--line)] pt-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-medium text-[var(--ink-3)]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
