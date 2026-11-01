import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
      <Link href="/" className="group flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)] sm:text-[1.7rem]">
          Clearhold
        </span>
        <span className="hidden text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:inline">
          PayPal + AI
        </span>
      </Link>
      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/resolve"
          className="rounded-md px-3 py-2 text-sm text-[var(--ink)]/80 transition hover:bg-white/40 hover:text-[var(--ink)]"
        >
          Unstick funds
        </Link>
        <Link
          href="/send"
          className="rounded-md bg-[var(--ink)] px-3.5 py-2 text-sm font-medium text-[var(--foam)] transition hover:bg-[var(--ink-soft)]"
        >
          Send safely
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--muted)] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>Clearhold — AI co-pilot for held PayPal payments.</p>
        <p>Sandbox-ready. Works in demo mode without keys.</p>
      </div>
    </footer>
  );
}
