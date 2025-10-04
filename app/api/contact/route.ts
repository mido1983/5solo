import { NextResponse } from "next/server";
import { Resend } from "resend";

import { digitsOnly, normalizeNational, toE164 } from "@/components/phone/phone-utils";

export const runtime = "edge";

const TO = "m0504471533@gmail.com";
const FROM = "5SOLO <no-reply@5solo.com>";
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const company = typeof body?.company === "string" ? body.company.trim() : "";
    if (company) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    const countryCode = digitsOnly(String(body?.phone_country_code ?? ""));
    const nationalRaw = String(body?.phone_national ?? "");
    const national = normalizeNational(nationalRaw);
    const phoneE164 = String(body?.phone_e164 ?? "").trim();

    if (!name || !email || !message || !countryCode || !national) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    if (national.length < 7 || national.length > 15) {
      return NextResponse.json({ error: "PHONE_INVALID" }, { status: 400 });
    }

    const expectedE164 = toE164(countryCode, national);
    if (phoneE164 !== expectedE164) {
      return NextResponse.json({ error: "PHONE_INVALID" }, { status: 400 });
    }

    if (!resend) {
      console.error("[contact:error] RESEND_API_KEY missing");
      return NextResponse.json({ error: "CONFIG_MISSING" }, { status: 500 });
    }

    const html = `
      <h2>Новая заявка с сайта 5SOLO</h2>
      <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(expectedE164)}</p>
      <p><strong>Сообщение:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: "5SOLO - новая заявка",
      html,
      reply_to: email || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact:error]", error);
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
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
