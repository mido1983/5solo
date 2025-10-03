import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/locales";
import { getLegalBackLink, getLegalContent } from "@/lib/content";
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
  const legal = getLegalContent(messages, "terms");
  if (!legal) {
    notFound();
  }

  return {
    title: legal.title,
    description: legal.intro,
    alternates: {
      canonical: canonicalUrl(localeParam, "legal/terms"),
      languages: languageAlternates("legal/terms"),
    },
    openGraph: {
      title: legal.title,
      description: legal.intro,
      url: canonicalUrl(localeParam, "legal/terms"),
      siteName: "5SOLO",
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: legal.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: legal.title,
      description: legal.intro,
      images: [absoluteUrl("/og.png")],
    },
  } satisfies Metadata;
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  const legal = getLegalContent(messages, "terms");

  if (!legal) {
    notFound();
  }

  const backLabel = getLegalBackLink(messages) || t(messages, "legal.backLink", "Back to home");

  return (
    <section className="bg-brand-base py-20">
      <div className="container space-y-10 text-brand-muted">
        <header className="space-y-4 text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{t(messages, "legal.terms.title", legal.title)}</p>
          <h1 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{legal.title}</h1>
          {legal.updated && <p className="text-sm text-brand-muted/80">{legal.updated}</p>}
          <p className="max-w-3xl">{legal.intro}</p>
        </header>
        <div className="space-y-8">
          {legal.sections.map((section) => (
            <article key={section.title} className="space-y-3 rounded-3xl border border-brand-line/60 bg-brand-surface/70 p-6">
              <h2 className="text-lg font-semibold text-brand-foreground">{section.title}</h2>
              <div className="space-y-3 text-sm">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="text-left">
          <Link
            href={localePath(locale)}
            className="text-sm font-semibold text-brand-muted transition hover:text-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            ← {backLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
