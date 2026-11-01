import { ResolveClient } from "@/components/resolve-client";
import { FadeIn } from "@/components/ui";

export default function ResolvePage() {
  return (
    <div className="px-6 py-10 sm:px-8 lg:px-12">
      <FadeIn>
        <div className="mx-auto mb-10 max-w-6xl">
          <p className="text-[13px] text-[var(--ink-3)]">Recipient</p>
          <h1
            className="mt-2 text-[36px] leading-[1.1] tracking-[-0.02em] text-[var(--ink)] sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Unstick held funds
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[var(--ink-2)]">
            Paste the hold notice. Clearhold classifies the payment, builds a
            document checklist, and drafts the reply.
          </p>
        </div>
      </FadeIn>
      <ResolveClient />
    </div>
  );
}
