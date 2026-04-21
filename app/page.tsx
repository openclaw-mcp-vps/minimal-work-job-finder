import Link from "next/link";
import { ArrowRight, Brain, ShieldCheck, TimerReset } from "lucide-react";

import { PricingCard } from "@/components/PricingCard";

const FAQ_ITEMS = [
  {
    question: "What makes this different from generic job boards?",
    answer:
      "Every listing is scored for workload sustainability. We prioritize companies with evidence of reasonable pacing, clear boundaries, and remote-friendly habits while filtering common burnout signals."
  },
  {
    question: "Will this only show junior roles?",
    answer:
      "No. The strongest demand comes from senior engineers, product managers, and designers who want impact without 60-hour weeks. Roles span IC and leadership tracks."
  },
  {
    question: "How fast are listings updated?",
    answer:
      "The dataset refreshes on demand and also reuses short-term caching to keep results fast. You can force a refresh inside the paid jobs explorer anytime."
  },
  {
    question: "Can I cancel if it is not useful for my search?",
    answer:
      "Yes. Subscription management is handled by Stripe hosted checkout and billing settings so you can cancel directly without support tickets."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-10 sm:px-8 lg:py-14">
      <section className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/65 p-7 shadow-2xl shadow-black/20 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
        <div>
          <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
            Burnout-safe job search
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-100 sm:text-5xl">
            Find Tech Jobs Requiring Minimal Actual Work
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Minimal Work Job Finder filters out startup chaos and high-pressure environments so you can focus on roles with healthy expectations, better boundaries, and room for real life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/unlock"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Premium Access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              See scoring approach
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Built for experienced developers, designers, and product managers who want sustainable growth instead of permanent firefighting.
          </p>
        </div>

        <PricingCard />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <TimerReset className="h-5 w-5 text-cyan-300" />
          <h2 className="mt-3 text-xl font-semibold text-slate-100">The Problem</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Too many "remote" jobs still expect instant replies, endless meetings, and after-hours fire drills. Traditional boards do not measure that risk.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
          <h2 className="mt-3 text-xl font-semibold text-slate-100">The Solution</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            We scrape vetted company boards, score each listing for workload signals, and suppress roles with strong burnout indicators before you spend time applying.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <Brain className="h-5 w-5 text-violet-300" />
          <h2 className="mt-3 text-xl font-semibold text-slate-100">Why It Works</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The ranking model combines company baseline quality, posting language, and pressure keywords so you can immediately prioritize roles with healthier odds.
          </p>
        </article>
      </section>

      <section id="how-it-works" className="rounded-3xl border border-slate-800 bg-slate-900/65 p-7 lg:p-10">
        <h2 className="text-3xl font-semibold text-slate-100">How the work-life scoring works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
            <h3 className="text-lg font-semibold text-emerald-300">Signals that raise a score</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Explicit mentions of flexible hours, async collaboration, sustainable pace, deep-work blocks, remote-first operations, and realistic staffing.
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
            <h3 className="text-lg font-semibold text-rose-300">Signals that lower a score</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Terms like "always-on", "hustle", "high-intensity", aggressive growth pressure, broad role inflation, and frequent on-call language.
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-400">
          Premium members can tune score threshold, force a fresh scrape, save searches, and keep a shortlist inside the dashboard.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-7 lg:p-10">
        <h2 className="text-3xl font-semibold text-slate-100">FAQ</h2>
        <div className="mt-5 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <article key={item.question} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
              <h3 className="text-lg font-semibold text-slate-100">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-400/25 bg-cyan-400/10 p-6 text-center">
        <h2 className="text-2xl font-semibold text-cyan-100">Stop spending your evenings recovering from your workday</h2>
        <p className="mt-3 text-sm text-cyan-50/90">
          Join Minimal Work Job Finder and search roles built for long-term performance and mental sustainability.
        </p>
        <Link
          href="/unlock"
          className="mt-5 inline-flex items-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Start with premium filters
        </Link>
      </section>
    </main>
  );
}
