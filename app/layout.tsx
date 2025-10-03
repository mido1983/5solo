import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

import "@/styles/tailwind.css";
import "@/styles/globals.css";

import { isLocale, type Locale } from "@/i18n/locales";
import { DEFAULT_DESCRIPTION, SITE_NAME, getDir, getLocaleFromPathname } from "@/lib/utils";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};

function resolveLocale(): Locale {
  const headerList = headers();
  const hintedLocale = headerList.get("x-locale");
  if (hintedLocale && isLocale(hintedLocale)) {
    return hintedLocale;
  }

  const hintedPath = headerList.get("x-pathname") ?? "/";
  return getLocaleFromPathname(hintedPath);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = resolveLocale();
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} bg-brand-base`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-brand-base text-brand-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
