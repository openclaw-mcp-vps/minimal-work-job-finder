import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/DashboardClient";
import { getAuthenticatedEmailFromCookieStore } from "@/lib/auth";
import { listSavedJobIds, listSavedSearches } from "@/lib/database";
import { getCuratedJobs } from "@/lib/job-scraper";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const email = getAuthenticatedEmailFromCookieStore(cookieStore);

  if (!email) {
    redirect("/unlock?next=/dashboard");
  }

  const [searches, savedJobIds, jobsPayload] = await Promise.all([
    listSavedSearches(email),
    listSavedJobIds(email),
    getCuratedJobs()
  ]);

  const savedJobs = jobsPayload.jobs.filter((job) => savedJobIds.includes(job.id));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8">
      <DashboardClient email={email} initialSearches={searches} initialSavedJobs={savedJobs} />
    </main>
  );
}
