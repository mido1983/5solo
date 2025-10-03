import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales, type Locale } from "./i18n/locales";

const PUBLIC_FILE = /\.(.*)$/;
const PUBLIC_PATHS = [
  /^\/_next\//,
  /^\/api\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /^\/og\.png$/,
];

function normalizeLocale(value?: string | null): Locale | undefined {
  if (!value) {
    return undefined;
  }

  const lower = value.toLowerCase();
  const candidate = lower.split("-")[0] as Locale;

  return locales.includes(candidate) ? candidate : undefined;
}

function pickLocaleFromHeader(header: string | null): Locale | undefined {
  if (!header) {
    return undefined;
  }

  const parsed = header
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=");
      const quality = qValue ? Number(qValue) : 1;
      return { tag, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const option of parsed) {
    const locale = normalizeLocale(option.tag);
    if (locale) {
      return locale;
    }
  }

  return undefined;
}

function extractLocale(pathname: string): Locale | undefined {
  const [first] = pathname.split("/").filter(Boolean);
  if (!first) {
    return undefined;
  }
  const locale = first.toLowerCase() as Locale;
  return locales.includes(locale) ? locale : undefined;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname) || PUBLIC_PATHS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  const currentLocale = extractLocale(pathname);

  if (currentLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("x-locale", currentLocale);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const cookieLocale = normalizeLocale(request.cookies.get("NEXT_LOCALE")?.value);
  const headerLocale = pickLocaleFromHeader(request.headers.get("accept-language"));
  const locale = cookieLocale ?? headerLocale ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.\w+$).*)"],
};
