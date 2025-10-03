import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/locales";
import { getCaseDetail, getCasesContent } from "@/lib/content";
import { getMessages, t } from "@/lib/i18n";
import { absoluteUrl, canonicalUrl, languageAlternates, localePath } from "@/lib/utils";

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const messages = await getMessages(locale);
    const casesContent = getCasesContent(messages);
    casesContent.items.forEach((item) => {
      params.push({ locale, slug: item.slug });
    });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale: localeParam, slug } = params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = await getMessages(localeParam);
  const detail = getCaseDetail(messages, slug);
  if (!detail) {
    notFound();
  }

  const description = detail.hero.subtitle || detail.name;

  return {
    title: detail.hero.title,
    description,
    alternates: {
      canonical: canonicalUrl(localeParam, `cases/${slug}`),
      languages: languageAlternates(`cases/${slug}`),
    },
    openGraph: {
      title: detail.hero.title,
      description,
      url: canonicalUrl(localeParam, `cases/${slug}`),
      siteName: "5SOLO",
      images: [
        {
          url: absoluteUrl(detail.gallery[0]?.src ?? "/og.png"),
          width: 1200,
          height: 630,
          alt: detail.gallery[0]?.alt ?? detail.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: detail.hero.title,
      description,
      images: [absoluteUrl(detail.gallery[0]?.src ?? "/og.png")],
    },
  } satisfies Metadata;
}

export default async function CaseDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  const detail = getCaseDetail(messages, slug);

  if (!detail) {
    notFound();
  }

  return (
    <article className="bg-brand-base py-20">
      <div className="container space-y-16">
        <header className="space-y-6 text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{detail.name}</p>
          <h1 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{detail.hero.title}</h1>
          {detail.hero.subtitle && <p className="max-w-3xl text-brand-muted">{detail.hero.subtitle}</p>}
          {detail.hero.metrics.length > 0 && (
            <div className="grid divide-y divide-brand-line/60 rounded-3xl border border-brand-line/60 bg-brand-surface/70 md:grid-cols-3 md:divide-y-0 md:divide-x">
              {detail.hero.metrics.map((metric) => (
                <div key={`${metric.label}-${metric.value}`} className="flex flex-col gap-1 p-6 text-brand-muted">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent-secondary">{metric.label}</span>
                  <span className="text-2xl font-semibold text-brand-foreground">{metric.value}</span>
                </div>
              ))}
            </div>
          )}
          {detail.stack.length > 0 && (
            <ul className="flex flex-wrap gap-2 text-xs text-brand-muted">
              {detail.stack.map((item) => (
                <li key={item} className="rounded-full border border-brand-line/60 bg-brand-surface/60 px-3 py-1">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </header>

        {detail.gallery.length > 0 && (
          <section className="grid gap-4 md:grid-cols-3">
            {detail.gallery.map((image) => (
              <div key={image.src} className="relative h-56 w-full overflow-hidden rounded-3xl border border-brand-line/60 bg-brand-surface/60">
                <Image
                  src={image.src}
                  alt={image.alt || detail.name}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-3">
          {detail.sections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-brand-line/60 bg-brand-surface/70 p-6 text-brand-muted">
              <h2 className="text-lg font-semibold text-brand-foreground">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="text-center">
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {detail.cta}
          </Link>
        </section>

        <section className="text-center">
          <Link
            href={localePath(locale, "cases")}
            className="text-sm font-semibold text-brand-muted transition hover:text-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            ← {t(messages, "cases.backLink", "Back to launches")}
          </Link>
        </section>
      </div>
    </article>
  );
}
