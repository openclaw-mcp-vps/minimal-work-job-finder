import { CheckCircle2 } from "lucide-react";

const INCLUDED_FEATURES = [
  "Daily refresh from vetted work-life balance companies",
  "Pressure score on every role with transparent risk signals",
  "Save searches and track roles worth applying to",
  "Access to premium low-pressure filters and remote focus"
];

export function PricingCard() {
  const buyLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-black/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">Premium Access</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-100">$19/month</h3>
          <p className="mt-1 text-sm text-slate-400">No contracts. Cancel anytime in under a minute.</p>
        </div>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          Built for sustainable careers
        </span>
      </div>

      <ul className="mt-6 space-y-3">
        {INCLUDED_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={buyLink}
        className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Buy Premium Access
      </a>
      {!buyLink ? (
        <p className="mt-3 text-xs text-amber-300">
          Set NEXT_PUBLIC_STRIPE_PAYMENT_LINK to activate checkout.
        </p>
      ) : null}
    </section>
  );
}
