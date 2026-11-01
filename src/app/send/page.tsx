import { SendClient } from "@/components/send-client";
import { FadeIn } from "@/components/ui";

export default function SendPage() {
  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <FadeIn>
        <div className="mx-auto mb-10 max-w-6xl">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
            Sender flow
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] sm:text-5xl">
            Send a safer payout
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Create a documented invoice package and send a PayPal payout with a
            clear purpose — so the recipient is less likely to sit in review for
            weeks.
          </p>
        </div>
      </FadeIn>
      <SendClient />
    </div>
  );
}
