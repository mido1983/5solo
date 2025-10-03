import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { getServicesContent } from "@/lib/content";
import { t, type Messages } from "@/lib/i18n";

interface ServicesProps {
  locale: Locale;
  messages: Messages;
}

export default function Services({ locale, messages }: ServicesProps) {
  const services = getServicesContent(messages);

  return (
    <section id="services" className="bg-brand-surface/60 py-20">
      <div className="container space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{services.label}</p>
          <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{services.title}</h2>
          <p className="mx-auto max-w-3xl text-brand-muted">{services.subtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.items.map((item) => (
            <article
              key={item.slug}
              className="flex h-full flex-col gap-6 rounded-3xl border border-brand-line/60 bg-brand-base/80 p-6 text-brand-muted shadow-[0_12px_40px_rgba(5,10,26,0.4)]"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-brand-foreground">{item.title}</h3>
                <p className="text-sm text-brand-muted">{item.tldr}</p>
              </div>
              {item.whatWeDo.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-secondary">
                    {services.headings.whatWeDo}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {item.whatWeDo.map((entry) => (
                      <li key={entry} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden />
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.benefits.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-secondary">
                    {services.headings.benefits}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {item.benefits.map((entry) => (
                      <li key={entry} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-secondary" aria-hidden />
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.faq.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-secondary">
                    {services.headings.faq}
                  </p>
                  <div className="space-y-2">
                    {item.faq.map((entry) => (
                      <details key={entry.question} className="rounded-2xl border border-brand-line/60 bg-brand-surface/60 p-3">
                        <summary className="cursor-pointer text-sm font-semibold text-brand-foreground">
                          {entry.question}
                        </summary>
                        <p className="mt-2 text-sm">{entry.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <Link
                  href={`/${locale}#contact`}
                  className="inline-flex items-center justify-center rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                >
                  {services.ctaLabel || t(messages, "cta.button")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

