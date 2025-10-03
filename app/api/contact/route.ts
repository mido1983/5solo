import { NextResponse } from "next/server";

const EMAIL_REGEX = /.+@.+\..+/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const honeypot = String(body?.company ?? "").trim();

    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    console.log("[contact]", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact:error]", error);
    return NextResponse.json({ error: "Unable to submit form." }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
