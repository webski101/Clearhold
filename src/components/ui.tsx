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
      className={`transition duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-emerald-100 text-emerald-900",
    medium: "bg-amber-100 text-amber-950",
    high: "bg-rose-100 text-rose-950",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${styles[level]}`}
    >
      {level} risk
    </span>
  );
}

export function ModePill({ mode }: { mode: "ai" | "demo" | "paypal" }) {
  const label =
    mode === "ai" ? "Live AI" : mode === "paypal" ? "PayPal sandbox" : "Demo engine";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-white/70 px-2.5 py-1 text-xs text-[var(--muted)]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          mode === "demo" ? "bg-amber-500" : "bg-emerald-500"
        } animate-pulse`}
      />
      {label}
    </span>
  );
}
