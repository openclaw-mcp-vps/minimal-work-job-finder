import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedEmailFromRequest } from "@/lib/auth";
import { getCuratedJobs } from "@/lib/job-scraper";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const jobs = await getCuratedJobs({ forceRefresh: true });
  return NextResponse.json({
    ok: true,
    refreshedAt: jobs.refreshedAt,
    count: jobs.jobs.length
  });
}
