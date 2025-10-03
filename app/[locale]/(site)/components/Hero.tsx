import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { getHeroMetrics } from "@/lib/content";
import { t, type Messages } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  messages: Messages;
}

export default function Hero({ locale, messages }: HeroProps) {
  const metrics = getHeroMetrics(messages);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-brand-base to-brand-base py-24"
    >
      <div className="container flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full border border-accent-secondary/40 bg-accent-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-accent-secondary">
            {t(messages, "hero.badge")}
          </span>
          <h1
            className="text-4xl font-semibold leading-tight text-brand-foreground md:text-5xl"
            dangerouslySetInnerHTML={{ __html: t(messages, "hero.title") }}
          />
          <p className="max-w-2xl text-lg text-brand-muted">{t(messages, "hero.subtitle")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              {t(messages, "hero.primaryCta")}
            </Link>
            <Link
              href={`/${locale}#services`}
              className="inline-flex items-center justify-center rounded-full border border-brand-line px-6 py-3 text-sm font-semibold text-brand-muted transition hover:text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              {t(messages, "hero.secondaryCta")}
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-brand-line/80 bg-brand-overlay/60 p-6 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  key={`${metric.label}-${metric.value}`}
                  className="flex h-24 flex-col justify-between rounded-2xl bg-brand-surface/70 p-4 shadow-inner"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-muted">{metric.label}</span>
                  <span className="text-lg font-semibold text-accent-secondary">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
