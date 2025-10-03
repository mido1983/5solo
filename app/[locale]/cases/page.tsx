import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/locales";
import { getCasesContent } from "@/lib/content";
import { getMessages, t } from "@/lib/i18n";
import { absoluteUrl, canonicalUrl, languageAlternates, localePath } from "@/lib/utils";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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

  const messages = await getMessages(localeParam);
  const casesContent = getCasesContent(messages);
  const title = casesContent.title || t(messages, "cases.title");
  const description = casesContent.subtitle || t(messages, "cases.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(localeParam, "cases"),
      languages: languageAlternates("cases"),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl(localeParam, "cases"),
      siteName: "5SOLO",
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: "5SOLO",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og.png")],
    },
  } satisfies Metadata;
}

export default async function CasesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  const casesContent = getCasesContent(messages);

  return (
    <section className="bg-brand-base py-20">
      <div className="container space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{casesContent.label}</p>
          <h1 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{casesContent.title}</h1>
          <p className="mx-auto max-w-3xl text-brand-muted">{casesContent.subtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {casesContent.items.map((item) => (
            <article
              key={item.slug}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-line/60 bg-brand-surface/70 transition hover:border-accent-primary/80"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1280px) 45vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6 text-brand-muted">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent-secondary">{item.name}</span>
                  <h2 className="text-xl font-semibold text-brand-foreground">{item.summary}</h2>
                </div>
                <p className="text-sm">{item.result}</p>
                <div className="mt-auto pt-2">
                  <Link
                    href={localePath(locale, `cases/${item.slug}`)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary transition hover:text-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                  >
                    {casesContent.detailLink}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {casesContent.cta || t(messages, "cases.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
