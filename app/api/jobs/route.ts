import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedEmailFromRequest } from "@/lib/auth";
import { getCuratedJobs } from "@/lib/job-scraper";
import { listSavedJobIds } from "@/lib/database";

const QuerySchema = z.object({
  query: z.string().trim().optional().default(""),
  role: z.string().trim().optional().default(""),
  remoteOnly: z.enum(["true", "false"]).optional().default("false"),
  minScore: z.coerce.number().min(0).max(100).optional().default(62),
  hideMixed: z.enum(["true", "false"]).optional().default("false")
});

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const queryValues = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(queryValues);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const { query, role, remoteOnly, minScore, hideMixed } = parsed.data;

  const [jobsPayload, savedJobIds] = await Promise.all([getCuratedJobs(), listSavedJobIds(email)]);

  const normalizedQuery = query.toLowerCase();
  const normalizedRole = role.toLowerCase();

  const jobs = jobsPayload.jobs.filter((job) => {
    if (remoteOnly === "true" && !job.remote) {
      return false;
    }

    if (job.workLife.score < minScore) {
      return false;
    }

    if (hideMixed === "true" && job.workLife.classification === "mixed") {
      return false;
    }

    if (normalizedRole.length > 0 && !job.title.toLowerCase().includes(normalizedRole)) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.descriptionSnippet}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  return NextResponse.json({
    jobs,
    savedJobIds,
    refreshedAt: jobsPayload.refreshedAt,
    source: jobsPayload.source
  });
}
