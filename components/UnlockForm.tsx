"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface UnlockFormProps {
  nextPath: string;
}

export function UnlockForm({ nextPath }: UnlockFormProps) {
  const router = useRouter();
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = useMemo(() => submitting || email.trim().length === 0, [submitting, email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Access could not be verified yet.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to verify access.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 shadow-xl shadow-black/25">
      <h1 className="text-3xl font-semibold text-slate-100">Unlock premium job filtering</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        1) Complete checkout with Stripe. 2) Enter the same email used for payment. We verify your purchase and enable instant access to the full jobs explorer.
      </p>

      <a
        href={paymentLink}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Buy Premium Access ($19/mo)
      </a>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">Purchase email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
          />
        </label>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Verifying..." : "Unlock my access"}
        </button>
      </form>

      {error ? <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}

      <p className="mt-4 text-xs text-slate-500">Webhook processing usually completes within a few seconds after payment.</p>
    </section>
  );
}
