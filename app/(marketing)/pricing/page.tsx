import { PricingCards } from "@/components/marketing/pricing-cards";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What payment methods do you accept?",
    a: "Card, mobile money (MTN, Vodafone, AirtelTigo), and bank transfer — all routed through Paystack. Subscriptions are billed in Ghana cedis (GH₵).",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Cancel from Settings → Billing. Pro stays active until the end of your current billing period. No partial refunds for the current period.",
  },
  {
    q: "Do you offer student or team discounts?",
    a: "Not yet. We'll announce student pricing and team plans on the changelog when they're ready.",
  },
  {
    q: "Is my data exportable?",
    a: "Always — Free and Pro both include JSON / Markdown / CSV exports from Settings → Data. Your content is yours.",
  },
  {
    q: "What happens if my payment fails?",
    a: "We notify you by email and retry over the next 72 hours. If the retries fail, you stay on Pro until the period ends and then drop to Free.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mx-auto mb-10 max-w-[52ch] text-center">
        <h1 className="text-[40px] font-semibold tracking-[-0.02em] text-fg md:text-[48px]">
          Honest pricing.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-fg-muted">
          Free for the essentials. Pro adds the assistant, sync, and reviews. Cancel any time.
        </p>
      </header>

      <PricingCards />

      <section className="mx-auto mt-20 max-w-[640px]">
        <h2 className="mb-6 text-[20px] font-semibold tracking-tight text-fg">Frequently asked</h2>
        <div className="space-y-2">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-surface-1 px-5 py-4">
              <summary className="cursor-pointer list-none">
                <span className="flex items-center justify-between gap-4 text-[14.5px] font-medium text-fg">
                  {f.q}
                  <span className="text-fg-subtle transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
