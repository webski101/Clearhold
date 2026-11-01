import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
      <Link href="/" className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full bg-[var(--held)]"
        />
        <span
          className="text-[17px] font-medium tracking-[-0.01em] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Clearhold
        </span>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/resolve"
          className="rounded-lg px-3 py-2 text-[14px] text-[var(--ink-2)] transition hover:bg-[var(--raised)] hover:text-[var(--ink)]"
        >
          Unstick funds
        </Link>
        <Link href="/send" className="btn-primary !min-h-9 !px-3.5 !text-[14px]">
          Send safely
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] px-6 py-8 text-[13px] text-[var(--ink-3)] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>Clearhold helps clear held PayPal payments with documentation</p>
        <p className="mono">Demo mode works without API keys</p>
      </div>
    </footer>
  );
}
