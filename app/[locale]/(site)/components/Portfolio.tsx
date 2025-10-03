import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { t, type Messages } from "@/lib/i18n";

const CASE_IDS = ["case1", "case2", "case3", "case4"] as const;

interface PortfolioProps {
  locale: Locale;
  messages: Messages;
}

export default function Portfolio({ locale, messages }: PortfolioProps) {
  return (
    <section id="portfolio" className="bg-graphite-900 py-20">
      <div className="container mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-widest text-accent-gold">{t(messages, "portfolio.label")}</p>
          <h2 className="text-3xl font-semibold text-body md:text-4xl">{t(messages, "portfolio.title")}</h2>
          <p className="mx-auto max-w-2xl text-body/70">{t(messages, "portfolio.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASE_IDS.map((caseId) => (
            <Link
              key={caseId}
              href={`/${locale}#contact`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-graphite-800/60 transition hover:border-accent-gold/50"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={`/images/portfolio/${caseId}.svg`}
                  alt={t(messages, `portfolio.items.${caseId}.alt`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-6">
                <h3 className="text-xl font-semibold text-body">
                  {t(messages, `portfolio.items.${caseId}.title`)}
                </h3>
                <p className="text-body/70">{t(messages, `portfolio.items.${caseId}.description`)}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue">
                  {t(messages, "portfolio.cta")}
                  <span aria-hidden>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

