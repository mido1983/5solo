import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

const TO = "m0504471533@gmail.com";
const FROM = "5SOLO <no-reply@5solo.com>";
const PHONE_REGEX = /^\+972\s\d{2}\s\d{2}\s\d{3}\s\d{2}$/;

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const company = String(form.get("company") ?? "");
    if (company) {
      return NextResponse.json({ ok: true });
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ error: "PHONE_INVALID" }, { status: 400 });
    }

    if (!resend) {
      console.error("[contact:error] RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "CONFIG_MISSING" }, { status: 500 });
    }

    const html = `
      <h2>Новая заявка с сайта 5SOLO</h2>
      <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
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
