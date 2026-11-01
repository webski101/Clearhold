import { ResolveClient } from "@/components/resolve-client";
import { FadeIn } from "@/components/ui";

export default function ResolvePage() {
  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <FadeIn>
        <div className="mx-auto mb-10 max-w-6xl">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
            Recipient flow
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] sm:text-5xl">
            Unstick held funds
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Paste what PayPal sent you. Clearhold classifies the payment, builds
            a document pack, and drafts the reply — without telling you to fake
            anything.
          </p>
        </div>
      </FadeIn>
      <ResolveClient />
    </div>
  );
}
