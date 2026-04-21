import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedEmailFromRequest } from "@/lib/auth";
import { deleteSavedSearch, listSavedSearches, saveSearch } from "@/lib/database";

const SaveSearchSchema = z.object({
  name: z.string().trim().min(2).max(80),
  query: z.string().trim().max(120).default(""),
  role: z.string().trim().max(80).default(""),
  remoteOnly: z.boolean().default(false),
  minScore: z.number().min(0).max(100)
});

const DeleteSearchSchema = z.object({
  id: z.string().uuid()
});

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const searches = await listSavedSearches(email);
  return NextResponse.json({ searches });
}

export async function POST(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = SaveSearchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const search = await saveSearch({ email, ...parsed.data });
  return NextResponse.json({ search });
}

export async function DELETE(request: NextRequest) {
  const email = getAuthenticatedEmailFromRequest(request);
  if (!email) {
    return NextResponse.json({ error: "Premium access required." }, { status: 402 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = DeleteSearchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const deleted = await deleteSavedSearch(email, parsed.data.id);
  return NextResponse.json({ deleted });
}
