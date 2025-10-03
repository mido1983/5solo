import { defaultLocale, isLocale, isRtl, locales, type Locale } from "@/i18n/locales";

export const SITE_NAME = "5SOLO";
export const DEFAULT_DESCRIPTION =
  "5SOLO brings strategy, design, development, media, and support together into one focused studio.";

const DEFAULT_BASE_URL = "https://5solo.example";

const normalizePath = (value: string): string => value.replace(/^\/+/, "").replace(/\/+$/, "");

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_BASE_URL;
}

export function absoluteUrl(pathname: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function localePath(locale: Locale, path = ""): string {
  const trimmed = normalizePath(path);
  if (!trimmed) {
    return `/${locale}`;
  }
  return `/${locale}/${trimmed}`.replace(/\/{2,}/g, "/");
}

export function canonicalUrl(locale: Locale, path = ""): string {
  return absoluteUrl(localePath(locale, path));
}

export function languageAlternates(path = ""): Record<string, string> {
  const trimmed = normalizePath(path);
  return Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localePath(locale, trimmed))]),
  );
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const [, maybeLocale] = pathname.split("/");
  if (maybeLocale && isLocale(maybeLocale)) {
    return maybeLocale;
  }
  return defaultLocale;
}

export function replaceLocaleInPathname(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && isLocale(segments[1] ?? "")) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }
  const suffix = pathname === "/" ? "" : pathname;
  return `/${locale}${suffix}`;
}
