import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedEmailFromRequest } from "@/lib/auth";
import { listSavedJobIds, toggleSavedJob } from "@/lib/database";

const ToggleSchema = z.object({
  jobId: z.string().trim().min(3)
});

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const savedJobIds = await listSavedJobIds(email);
  return NextResponse.json({ savedJobIds });
}

export async function POST(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = ToggleSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const result = await toggleSavedJob(email, parsed.data.jobId);
  return NextResponse.json(result);
}
