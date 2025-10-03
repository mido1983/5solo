import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { t, type Messages } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  messages: Messages;
}

export default function Hero({ locale, messages }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-graphite-800/80 to-graphite-900 py-24">
      <div className="container mx-auto flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full border border-accent-gold/40 bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-gold">
            {t(messages, "hero.badge")}
          </span>
          <h1
            className="text-4xl font-semibold leading-tight text-body md:text-5xl"
            dangerouslySetInnerHTML={{ __html: t(messages, "hero.title") }}
          />
          <p className="max-w-2xl text-lg text-body/70">{t(messages, "hero.subtitle")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-graphite-900 shadow-glow transition hover:scale-[1.02] hover:bg-accent-blue/90 focus-visible:outline"
            >
              {t(messages, "hero.cta")}
            </Link>
            <Link
              href={`/${locale}#services`}
              className="inline-flex items-center justify-center rounded-full border border-body/30 px-6 py-3 text-sm font-semibold text-body/80 transition hover:text-body"
            >
              {t(messages, "hero.secondaryCta")}
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto h-64 w-full max-w-md rounded-3xl border border-white/10 bg-surface/60 p-6 shadow-[0_10px_60px_rgba(22,40,60,0.4)]">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-24 flex-col justify-between rounded-2xl bg-graphite-800/70 p-4"
                >
                  <span className="text-xs uppercase text-body/50">
                    {t(messages, `hero.cards.${index + 1}.title`)}
                  </span>
                  <span className="text-lg font-semibold text-accent-gold">
                    {t(messages, `hero.cards.${index + 1}.value`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
