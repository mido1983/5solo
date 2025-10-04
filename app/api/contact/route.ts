import { NextResponse } from "next/server";
import { Resend } from "resend";

import { digitsOnly, stripOneLeadingZero, toE164 } from "@/components/phone/utils";
import { isHoneypotHit, isTooFast, verifyTurnstile } from "@/lib/antispam";

export const runtime = "edge";

const TO = "m0504471533@gmail.com";
const FROM = "5SOLO <no-reply@5solo.com>";
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const MIN_SUBMIT_DELAY_MS = 3000;
const isDev = process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const website = typeof body?.website === "string" ? body.website.trim() : "";
    if (isHoneypotHit(website)) {
      return NextResponse.json({ error: "honeypot" }, { status: 400 });
    }

    const tsClientRaw = typeof body?.ts === "string" || typeof body?.ts === "number" ? body.ts : "0";
    if (isTooFast(tsClientRaw, MIN_SUBMIT_DELAY_MS)) {
      return NextResponse.json({ error: "too_fast" }, { status: 400 });
    }

    const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken.trim() : "";
    if (!turnstileToken) {
      return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
    }

    const ipHeader =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    const captcha = await verifyTurnstile(turnstileToken, ipHeader);
    if (!captcha.success) {
      return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
    }

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    const countryCode = digitsOnly(String(body?.phone_country_code ?? ""));
    const nationalRaw = String(body?.phone_national ?? "");
    const national = stripOneLeadingZero(digitsOnly(nationalRaw));
    const phoneE164 = String(body?.phone_e164 ?? "").trim();

    if (!name || !email || !message || !countryCode || !national) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (national.length < 7 || national.length > 15) {
      return NextResponse.json({ error: "phone_invalid" }, { status: 400 });
    }

    const expectedE164 = toE164(countryCode, national);
    if (phoneE164 !== expectedE164) {
      return NextResponse.json({ error: "phone_invalid" }, { status: 400 });
    }

    if (!resend) {
      if (isDev) {
        console.error("[contact:error] RESEND_API_KEY missing");
      }
      return NextResponse.json({ error: "config_missing" }, { status: 500 });
    }

    const html = `
      <h2>????? ?????? ? ????? 5SOLO</h2>
      <p><strong>???:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>???????:</strong> ${escapeHtml(expectedE164)}</p>
      <p><strong>?????????:</strong><br/>${escapeHtml(message).replace(/\\n/g, "<br/>")}</p>
    `;

    await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: "5SOLO - ????? ??????",
      html,
      reply_to: email || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isDev) {
      console.error("[contact:error]", error);
    }
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}
