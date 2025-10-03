import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { t, type Messages } from "@/lib/i18n";

interface CtaProps {
  locale: Locale;
  messages: Messages;
}

export default function CTA({ locale, messages }: CtaProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-accent-primary/10 via-brand-base to-accent-secondary/10 py-20">
      <div className="container flex flex-col items-center gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{t(messages, "cta.label")}</p>
        <h2 className="max-w-3xl text-3xl font-semibold text-brand-foreground md:text-4xl">{t(messages, "cta.title")}</h2>
        <p className="max-w-2xl text-brand-muted">{t(messages, "cta.subtitle")}</p>
        <Link
          href={`/${locale}#contact`}
          className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        >
          {t(messages, "cta.button")}
        </Link>
      </div>
    </section>
  );
}
