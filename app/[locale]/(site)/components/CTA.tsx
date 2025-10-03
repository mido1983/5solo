import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { t, type Messages } from "@/lib/i18n";

interface CtaProps {
  locale: Locale;
  messages: Messages;
}

export default function CTA({ locale, messages }: CtaProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-accent-blue/10 via-graphite-900 to-accent-gold/10 py-20">
      <div className="container mx-auto flex flex-col items-center gap-6 text-center">
        <p className="text-sm uppercase tracking-widest text-accent-gold">{t(messages, "cta.label")}</p>
        <h2 className="max-w-3xl text-3xl font-semibold text-body md:text-4xl">{t(messages, "cta.title")}</h2>
        <p className="max-w-2xl text-body/70">{t(messages, "cta.subtitle")}</p>
        <Link
          href={`/${locale}#contact`}
          className="inline-flex items-center justify-center rounded-full bg-accent-gold px-6 py-3 text-sm font-semibold text-graphite-900 transition hover:scale-105"
        >
          {t(messages, "cta.button")}
        </Link>
      </div>
    </section>
  );
}
