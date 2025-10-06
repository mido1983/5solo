import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/locales";
import { isLocale } from "@/i18n/locales";
import { getCasesContent, getOfferContent } from "@/lib/content";
import { getMessages, t } from "@/lib/i18n";

import About from "./components/About";
import CTA from "./components/CTA";
import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Offer from "./components/Offer";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

export default async function SitePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  const casesContent = getCasesContent(locale as Locale);
  const offer = getOfferContent(messages);
  const cases = casesContent.items.slice(0, 3);

  return (
    <>
      <Hero locale={locale} messages={messages} />
      <About messages={messages} />
      <Services locale={locale} messages={messages} />
      <Offer locale={locale} offer={offer} />
      <Portfolio locale={locale} messages={messages} casesContent={casesContent} cases={cases} />
      <Testimonials messages={messages} />
      <CTA locale={locale} messages={messages} />
      <section id="contact" className="bg-brand-base py-20">
        <div className="container mx-auto flex max-w-3xl flex-col gap-6">
          <div className="space-y-4 text-left">
            <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">
              {t(messages, "contact.label")}
            </p>
            <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">
              {t(messages, "contact.title")}
            </h2>
            <p className="text-brand-muted">{t(messages, "contact.subtitle")}</p>
          </div>
          <ContactForm messages={messages} />
        </div>
      </section>
    </>
  );
}
