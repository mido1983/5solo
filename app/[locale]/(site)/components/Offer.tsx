import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import type { OfferContent } from "@/lib/content";

interface OfferProps {
  locale: Locale;
  offer: OfferContent | null;
}

export default function Offer({ locale, offer }: OfferProps) {
  if (!offer) {
    return null;
  }

  return (
    <section className="bg-brand-base py-20">
      <div className="container flex flex-col gap-8 rounded-3xl border border-brand-line/60 bg-brand-overlay/50 p-8 text-brand-muted shadow-[0_20px_60px_rgba(5,10,26,0.45)] md:flex-row md:items-center md:justify-between">
        <div className="space-y-4 md:max-w-2xl">
          {offer.label ? (
            <span className="inline-flex items-center rounded-full border border-accent-secondary/40 bg-accent-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-accent-secondary">
              {offer.label}
            </span>
          ) : null}
          <h3 className="text-2xl font-semibold text-brand-foreground md:text-3xl">{offer.title}</h3>
          <p>{offer.subtitle}</p>
          {offer.bullets.length > 0 && (
            <ul className="space-y-2 text-sm">
              {offer.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          {offer.footnote && <p className="text-xs text-brand-muted/80">{offer.footnote}</p>}
        </div>
        <div className="shrink-0">
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {offer.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}