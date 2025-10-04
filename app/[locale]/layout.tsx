import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { metaByLocale, type SupportedLocale } from "@/i18n/meta";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/locales";
import { SITE_URL, BRAND } from "@/lib/site";
import { getMessages, type Messages } from "@/lib/i18n";
import { getDir } from "@/lib/utils";

import Footer from "./(site)/components/Footer";
import Header from "./(site)/components/Header";

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
  params: { locale: SupportedLocale };
}): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const meta = metaByLocale[locale] ?? metaByLocale.en;
  const ogImage = `${SITE_URL}/og-1200x630.jpg?v=1`;
  const href = (lang: SupportedLocale) => `${SITE_URL}/${lang}`;
  const openGraphLocale = locale === "he" ? "he_IL" : locale === "ru" ? "ru_RU" : "en_US";

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: href(locale),
      languages: {
        en: href("en"),
        ru: href("ru"),
        he: href("he"),
      },
    },
    openGraph: {
      type: "website",
      url: href(locale),
      siteName: BRAND,
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: openGraphLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
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