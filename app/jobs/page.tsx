import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { JobsExplorer } from "@/components/JobsExplorer";
import { getAuthenticatedEmailFromCookieStore } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const cookieStore = await cookies();
  const email = getAuthenticatedEmailFromCookieStore(cookieStore);

  if (!email) {
    redirect("/unlock?next=/jobs");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">Premium jobs explorer</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-100">Balanced tech roles, ranked by workload sustainability</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Apply faster by focusing on companies and role descriptions with the best probability of healthy expectations.
        </p>
      </header>

      <JobsExplorer />
    </main>
  );
}
