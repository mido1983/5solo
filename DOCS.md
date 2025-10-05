# 5SOLO Project Documentation

## Overview
- **Framework**: Next.js 14 (App Router) with TypeScript.
- **Styling**: Tailwind CSS.
- **Forms**: react-hook-form for state management & validation.
- **Email**: Resend API sends contact-form submissions.
- **Anti-spam**: Honeypot and time-trap built-in; optional Cloudflare Turnstile widget (currently disabled).
- **Runtime**: Most API routes run on Edge (`app/api/contact/route.ts`).

### Directory Structure (top-level)
- `app/` – Routes, layouts, and page-level components.
- `components/` – Reusable UI pieces (`phone`, `anti-spam`, etc.).
- `lib/` – Shared utilities (e.g., `antispam.ts`).
- `i18n/` – Localisation helpers.
- `public/`, `styles/`, `types/` – Static assets, Tailwind/global CSS, shared types.

## Getting Started
1. **Install dependencies**: `npm install`.
2. **Dev server**: `npm run dev` (hot reload at http://localhost:3000).
3. **Lint**: `npm run lint`.
4. **Type-check** (optional): `npm run typecheck`.
5. **Build**: `npm run build`, then `npm run start` for local production.

## Environment Variables
Set these in `.env.local` (or Vercel dashboard):
```
RESEND_API_KEY=
TURNSTILE_SECRET_KEY=
TURNSTILE_SITE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```
- Turnstile keys are optional while CAPTCHA is disabled, but keep them configured for re-enabling later.
- After changes, restart `npm run dev` or redeploy (Vercel) to refresh env values.

## Contact Form Flow
- **Client**: `app/[locale]/(site)/components/ContactForm.tsx`
  - Uses `Controller` (react-hook-form) and inline phone field (`components/phone/phone-inline.tsx`).
  - Phone field filters digits, enforces 7–15 digits, and displays E.164 preview.
  - Honeypot (`website`) is a hidden field; `ts` stores render timestamp (time-trap).
  - Turnstile embed (`TurnstileBox`) is gated by `TURNSTILE_ENABLED` flag (currently `false`).
- **API**: `app/api/contact/route.ts`
  - Edge handler; validates honeypot & time delay, normalizes phone data, composes Resend email.
  - Email subject/body currently plain English (ASCII) to avoid encoding issues.
  - Turnstile verification runs only when `TURNSTILE_ENABLED` is `true`.

## Email Template
- Subject: `5SOLO - New contact request`.
- Body: HTML with escaped user fields (`Name`, `Email`, `Phone`, `Message`). Newlines → `<br/>`.
- Function `escapeHtml` prevents injection.

## Anti-Spam & Turnstile
- Turnstile script loads globally in `app/layout.tsx` via `next/script`.
- `components/anti-spam/TurnstileBox.tsx` handles widget lifecycle (polls for `window.turnstile`, resets on error, cleans up on unmount).
- **Currently disabled** via constants in both ContactForm and API route. Set `TURNSTILE_ENABLED = true` (or use env flag) to re-enable.
- When re-enabling, ensure Cloudflare Turnstile widget lists each active domain (no wildcards), and keys exist in env vars.

## Security Headers & CSP
- Defined in `next.config.mjs`: Content-Security-Policy with allowances for `https://challenges.cloudflare.com`, `https://vercel.live`, and `https://*.vercel-insights.com`.
- Additional headers: `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`.

## Coding Guidelines
- Keep logic in event handlers instead of `useEffect` loops (especially with react-hook-form).
- Prefer ASCII strings for critical emails unless explicitly handling encoding.
- Reuse helper utilities (e.g., `digitsOnly`, `stripOneLeadingZero`) to maintain consistent validation.
- Follow existing Tailwind utility patterns; avoid inline styles except for hidden honeypot field.

## Troubleshooting
- **Phone errors**: Ensure national number length 7–15 digits; field normalizes automatically.
- **CAPTCHA missing**: Turnstile disabled by design; re-enable and verify domain list + keys if needed.
- **Email shows ???**: Already fixed by using ASCII subject & body; if reintroducing localisation, ensure UTF-8 & `Content-Type: text/html; charset=UTF-8`.
- **CSP warnings**: Check `next.config.mjs` if new external scripts/frames are added.
- **Resend failures**: Confirm `RESEND_API_KEY` and monitor console logs (`[contact:error]`).

## Deployment Notes
- Hosted on Vercel; environment variables managed in the Vercel dashboard.
- For preview deployments, configure a dedicated subdomain (wildcards unsupported by Turnstile free tier).
- Run `npm run build` locally before pushing to catch compile issues.

---
Last updated: $(Get-Date -Format "yyyy-MM-dd")
