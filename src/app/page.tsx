import Link from "next/link";
import { FadeIn, StatusCase } from "@/components/ui";

export default function Home() {
  return (
    <>
      <section className="px-6 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-xl">
            <FadeIn>
              <p
                className="text-[56px] leading-[1.02] tracking-[-0.03em] text-[var(--ink)] sm:text-[64px] lg:text-[72px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                Clearhold
              </p>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="mt-5 text-[22px] font-medium leading-8 text-[var(--ink)] sm:text-[24px]">
                Get held PayPal money moving again
              </h1>
            </FadeIn>
            <FadeIn delay={140}>
              <p className="mt-4 max-w-md text-[16px] leading-7 text-[var(--ink-2)]">
                Paste a hold notice, get a reply draft and document checklist.
                Or send a payout with an invoice trail so review happens less
                often.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
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
          <FadeIn delay={120}>
            <StatusCase />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2
            className="max-w-2xl text-[32px] leading-[1.15] tracking-[-0.02em] text-[var(--ink)] sm:text-[36px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            For people paid across borders, and the people paying them
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-[16px] font-medium text-[var(--ink)]">
                Recipients
              </h3>
              <p className="mt-2 max-w-md text-[15px] leading-6 text-[var(--ink-2)]">
                Diagnose the hold, assemble a source-of-funds pack, and send a
                clear reply to PayPal support.
              </p>
            </div>
            <div>
              <h3 className="text-[16px] font-medium text-[var(--ink)]">
                Senders
              </h3>
              <p className="mt-2 max-w-md text-[15px] leading-6 text-[var(--ink-2)]">
                Create an invoice pack and PayPal payout with an explicit
                purpose note before the money moves.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
