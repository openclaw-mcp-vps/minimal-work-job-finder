import { NextRequest, NextResponse } from "next/server";

import { recordPurchase } from "@/lib/database";
import { extractPaidEmail, StripeEvent, verifyStripeWebhookSignature } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  const valid = verifyStripeWebhookSignature(payload, signature, secret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid event payload." }, { status: 400 });
  }

  const email = extractPaidEmail(event);
  if (email) {
    await recordPurchase(email, event.id);
  }

  return NextResponse.json({ received: true });
}
