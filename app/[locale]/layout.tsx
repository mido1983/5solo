import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/locales";
import { getMessages, t, type Messages } from "@/lib/i18n";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  canonicalUrl,
  getDir,
  languageAlternates,
} from "@/lib/utils";

import Footer from "./(site)/components/Footer";
import Header from "./(site)/components/Header";

const FALLBACK_TAGLINE = "Five disciplines. One outcome.";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function resolveMessages(locale: Locale): Promise<Messages> {
  try {
    return await getMessages(locale);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Missing messages for locale: ${locale}`, error);
    }
    return await getMessages(defaultLocale);
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale: localeParam } = params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = await resolveMessages(localeParam);
  const tagline = t(messages, "brand.tagline", FALLBACK_TAGLINE);
  const title = t(messages, "seo.title", `${SITE_NAME} — ${tagline}`);
  const description = t(messages, "seo.description", DEFAULT_DESCRIPTION);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(localeParam),
      languages: languageAlternates(),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl(localeParam),
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
      locale: localeParam,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og.png")],
    },
  } satisfies Metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale: localeParam } = params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = await resolveMessages(localeParam);
  const dir = getDir(localeParam);

  return (
    <div className={`min-h-screen bg-brand-base text-brand-foreground ${dir === "rtl" ? "rtl" : "ltr"}`}>
      <Header locale={localeParam} messages={messages} />
      <main>{children}</main>
      <Footer locale={localeParam} messages={messages} />
    </div>
  );
}
