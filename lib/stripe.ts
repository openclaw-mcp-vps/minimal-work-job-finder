import crypto from "node:crypto";

export interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const digest = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return signatures.some((signature) => {
    const expected = Buffer.from(digest, "utf8");
    const candidate = Buffer.from(signature, "utf8");

    return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
  });
}

export function extractPaidEmail(event: StripeEvent): string | null {
  if (event.type !== "checkout.session.completed") {
    return null;
  }

  const payload = event.data.object;
  const customerEmail = payload.customer_email;
  if (typeof customerEmail === "string" && customerEmail.trim().length > 0) {
    return customerEmail.trim().toLowerCase();
  }

  const details = payload.customer_details;
  if (typeof details === "object" && details && "email" in details) {
    const email = (details as { email?: unknown }).email;
    if (typeof email === "string" && email.trim().length > 0) {
      return email.trim().toLowerCase();
    }
  }

  return null;
}
