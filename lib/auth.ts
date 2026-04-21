import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "mwjf_access";
const ACCESS_COOKIE_DAYS = 30;

interface TokenPayload {
  email: string;
  exp: number;
}

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "local-dev-secret-change-me";
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

export function createAccessToken(email: string): string {
  const payload: TokenPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ACCESS_COOKIE_DAYS * 24 * 60 * 60
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string | undefined): string | null {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expected = sign(payloadPart);
  const signature = Buffer.from(signaturePart);
  const comparison = Buffer.from(expected);

  if (signature.length !== comparison.length || !crypto.timingSafeEqual(signature, comparison)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payloadPart)) as TokenPayload;
    if (!parsed.email || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed.email;
  } catch {
    return null;
  }
}

export function attachAccessCookie(response: NextResponse, email: string): NextResponse {
  response.cookies.set(ACCESS_COOKIE_NAME, createAccessToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_DAYS * 24 * 60 * 60
  });

  return response;
}

export function clearAccessCookie(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}

export function getAuthenticatedEmailFromRequest(request: NextRequest): string | null {
  return verifyAccessToken(request.cookies.get(ACCESS_COOKIE_NAME)?.value);
}

export function getAuthenticatedEmailFromCookieStore(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): string | null {
  return verifyAccessToken(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
}

export const ACCESS_COOKIE = ACCESS_COOKIE_NAME;
