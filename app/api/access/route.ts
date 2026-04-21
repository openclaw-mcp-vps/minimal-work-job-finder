import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { attachAccessCookie } from "@/lib/auth";
import { hasActivePurchase } from "@/lib/database";

const AccessSchema = z.object({
  email: z.string().trim().email()
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = AccessSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const paid = await hasActivePurchase(email);

  if (!paid) {
    return NextResponse.json(
      {
        error:
          "No completed purchase found for this email yet. If checkout was just completed, wait 30-60 seconds and try again."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  attachAccessCookie(response, email);
  return response;
}
