"use client";

import { useEffect, useState, type ReactNode } from "react";

export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  return (
    <div
      className={`transition duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-[#ecfdf3] text-[#15803d]",
    medium: "bg-[#fff7ed] text-[#9a3412]",
    high: "bg-[#fef2f2] text-[#b91c1c]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium ${styles[level]}`}
    >
      {level} risk
    </span>
  );
}

export function ModePill({ mode }: { mode: "ai" | "demo" | "paypal" }) {
  const label =
    mode === "ai"
      ? "Free AI"
      : mode === "paypal"
        ? "PayPal sandbox"
        : "Demo engine";
  return (
    <span className="mono inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-[12px] text-[var(--ink-3)]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          mode === "demo" ? "bg-[var(--held)]" : "bg-[var(--clear)]"
        }`}
      />
      {label}
    </span>
  );
}

export function StatusCase() {
  return (
    <div className="status-case" aria-label="Example payment case">
      <div className="status-case__head">
        <div>
          <p className="mono text-[12px] text-[var(--ink-3)]">Case CH-2481</p>
          <p className="mt-1 text-[15px] font-medium text-[var(--ink)]">
            Inbound payout · USD 2,500.00
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md bg-[#fff7ed] px-2.5 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]">
          <span className="status-dot !bg-[var(--held)]" />
          Held
        </span>
      </div>
      <div className="status-case__body">
        <div className="status-rail">
          <div className="status-step" data-state="done">
            <span className="status-dot" />
            <p className="mt-2 text-[13px] font-medium text-[var(--ink)]">Sent</p>
            <p className="mono mt-1 text-[11px] text-[var(--ink-3)]">Oct 2</p>
          </div>
          <div className="status-step" data-state="done">
            <span className="status-dot" />
            <p className="mt-2 text-[13px] font-medium text-[var(--ink)]">Pending</p>
            <p className="mono mt-1 text-[11px] text-[var(--ink-3)]">Oct 2</p>
          </div>
          <div className="status-step" data-state="active">
            <span className="status-dot" />
            <p className="mt-2 text-[13px] font-medium text-[var(--ink)]">Review</p>
            <p className="mono mt-1 text-[11px] text-[var(--ink-3)]">Now</p>
          </div>
          <div className="status-step">
            <span className="status-dot" />
            <p className="mt-2 text-[13px] font-medium text-[var(--ink)]">Available</p>
            <p className="mono mt-1 text-[11px] text-[var(--ink-3)]">—</p>
          </div>
        </div>
        <p className="mt-5 text-[13px] leading-5 text-[var(--ink-2)]">
          Source-of-funds reply drafted. Invoice pack ready to attach.
        </p>
      </div>
    </div>
  );
}
