import Link from "next/link";
import { FadeIn } from "@/components/ui";

export default function Home() {
  return (
    <>
      <section className="hero-shell px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl pb-4">
            <FadeIn>
              <p className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl">
                Clearhold
              </p>
            </FadeIn>
            <FadeIn delay={90}>
              <h1 className="mt-5 max-w-xl text-2xl font-medium leading-snug text-[var(--ink)] sm:text-3xl">
                Get held PayPal money moving again.
              </h1>
            </FadeIn>
            <FadeIn delay={160}>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                International payments get stuck in review for weeks. Clearhold
                uses AI + PayPal to diagnose the hold, draft your reply, and help
                senders pay with documentation that clears faster.
              </p>
            </FadeIn>
            <FadeIn delay={230}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/resolve" className="btn-primary">
                  Unstick my funds
                </Link>
                <Link href="/send" className="btn-secondary">
                  Send a safer payout
                </Link>
              </div>
            </FadeIn>
          </div>
          <div className="hero-visual" aria-hidden="true" />
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
              Built for freelancers, creators, contractors, and anyone paid across borders.
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              One product. Two sides of the same delay: recipients who are stuck,
              and senders who want the money to land cleanly the first time.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <FadeIn delay={80}>
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  For recipients
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  Paste the hold notice. Get a cause, checklist, and a support
                  reply you can send today.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={140}>
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  For senders
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  Create a PayPal invoice pack and payout with an explicit purpose
                  note — not a blank international transfer.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
              PayPal + AI, end to end.
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Diagnose holds with AI. Create invoices and payouts through PayPal
              APIs. Track status. Demo mode works out of the box; add keys for
              live sandbox calls.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
