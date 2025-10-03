import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/utils";
import { t, type Messages } from "@/lib/i18n";
import type { CaseSummary, CasesContent } from "@/lib/content";

type PortfolioProps = {
  locale: Locale;
  messages: Messages;
  casesContent: CasesContent;
  cases: CaseSummary[];
};

export default function Portfolio({ locale, messages, casesContent, cases }: PortfolioProps) {
  const cardCta = casesContent.detailLink || t(messages, "portfolio.cta");

  return (
    <section id="portfolio" className="bg-brand-base py-20">
      <div className="container space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">
            {t(messages, "portfolio.label", casesContent.label)}
          </p>
          <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">
            {t(messages, "portfolio.title", casesContent.title)}
          </h2>
          <p className="mx-auto max-w-3xl text-brand-muted">
            {t(messages, "portfolio.subtitle", casesContent.subtitle)}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <article
              key={item.slug}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-line/60 bg-brand-surface/70 transition hover:border-accent-primary/80"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 text-brand-muted">
                <span className="text-xs uppercase tracking-[0.3em] text-accent-secondary">{item.name}</span>
                <p className="text-lg font-semibold text-brand-foreground">{item.summary}</p>
                <p className="text-sm">{item.result}</p>
                <div className="pt-2">
                  <Link
                    href={localePath(locale, `cases/${item.slug}`)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary transition hover:text-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                  >
                    {cardCta}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
