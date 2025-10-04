/**
 * README – Cloudflare Turnstile setup
 * 1. Sign in to Cloudflare, open Turnstile, and create a widget for your domain.
 * 2. Copy the generated Site Key and Secret Key.
 * 3. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY=SITE_KEY and TURNSTILE_SECRET_KEY=SECRET_KEY to .env.local.
 * 4. Redeploy or restart the Next.js app so runtime and edge environments pick up the variables.
 */

const TURNSTILE_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResult = {
  success: boolean;
  code?: string;
};

/**
 * Calls Cloudflare Turnstile verification endpoint and returns success flag plus error code.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY is not configured");
    }
    return { success: false, code: "missing_secret" };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (ip) {
      params.append("remoteip", ip);
    }

    const response = await fetch(TURNSTILE_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      return { success: false, code: `http_${response.status}` };
    }

    const payload = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    const errors = Array.isArray(payload["error-codes"]) ? payload["error-codes"] : undefined;

    return {
      success: Boolean(payload.success),
      code: payload.success ? undefined : errors?.[0],
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[turnstile] verification failed", error);
    }
    return { success: false, code: "network_error" };
  }
}

/**
 * Returns true when the hidden honeypot field is filled in, indicating a bot submission.
 */
export function isHoneypotHit(website: string): boolean {
  return Boolean(website && website.trim().length > 0);
}

/**
 * Checks whether the form was submitted too fast (before minMs elapsed from initial render).
 */
export function isTooFast(tsClient: number | string, minMs = 3000): boolean {
  const tsNumber = typeof tsClient === "string" ? Number(tsClient) : tsClient;
  if (!Number.isFinite(tsNumber) || tsNumber <= 0) {
    return true;
  }
  return Date.now() - tsNumber < minMs;
}
