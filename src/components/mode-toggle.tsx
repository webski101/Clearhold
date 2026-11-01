"use client";

import { useAppMode } from "@/lib/mode";

export function ModeToggle() {
  const { mode, setMode } = useAppMode();

  return (
    <div
      className="inline-flex items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5"
      role="group"
      aria-label="App mode"
    >
      <button
        type="button"
        onClick={() => setMode("live")}
        className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
          mode === "live"
            ? "bg-[var(--ink)] text-[var(--surface)]"
            : "text-[var(--ink-3)] hover:text-[var(--ink)]"
        }`}
      >
        Live
      </button>
      <button
        type="button"
        onClick={() => setMode("demo")}
        className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
          mode === "demo"
            ? "bg-[var(--held)] text-white"
            : "text-[var(--ink-3)] hover:text-[var(--ink)]"
        }`}
      >
        Demo
      </button>
    </div>
  );
}
