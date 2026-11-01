import { SendClient } from "@/components/send-client";
import { FadeIn } from "@/components/ui";

export default function SendPage() {
  return (
    <div className="px-6 py-10 sm:px-8 lg:px-12">
      <FadeIn>
        <div className="mx-auto mb-10 max-w-6xl">
          <p className="text-[13px] text-[var(--ink-3)]">Sender</p>
          <h1
            className="mt-2 text-[36px] leading-[1.1] tracking-[-0.02em] text-[var(--ink)] sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Send a safer payout
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[var(--ink-2)]">
            Create a documented invoice package and send a PayPal payout with a
            clear purpose.
          </p>
        </div>
      </FadeIn>
      <SendClient />
    </div>
  );
}
