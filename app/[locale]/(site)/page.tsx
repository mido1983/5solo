import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/locales";
import { isLocale } from "@/i18n/locales";
import { getMessages, t } from "@/lib/i18n";

import About from "./components/About";
import CTA from "./components/CTA";
import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

export default async function SitePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <>
      <Hero locale={locale} messages={messages} />
      <About messages={messages} />
      <Services messages={messages} />
      <Portfolio locale={locale} messages={messages} />
      <Testimonials messages={messages} />
      <CTA locale={locale} messages={messages} />
      <section id="contact" className="bg-graphite-900 py-20">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-widest text-accent-gold">
              {t(messages, "contact.label")}
            </p>
            <h2 className="text-3xl font-semibold text-body md:text-4xl">
              {t(messages, "contact.title")}
            </h2>
            <p className="max-w-2xl text-body/70">{t(messages, "contact.subtitle")}</p>
            <ContactForm messages={messages} />
          </div>
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-graphite-800/40 p-8 text-sm text-body/70">
            <div>
              <h3 className="text-base font-semibold text-body">
                {t(messages, "contact.sidebar.title")}
              </h3>
              <p className="mt-2">{t(messages, "contact.sidebar.description")}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-body">{t(messages, "contact.sidebar.emailLabel")}</p>
              <a
                href={`mailto:${t(messages, "footer.contact.email")}`}
                className="text-accent-blue hover:underline"
              >
                {t(messages, "footer.contact.email")}
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-body">{t(messages, "contact.sidebar.phoneLabel")}</p>
              <a
                href={`tel:${t(messages, "footer.contact.phoneLink")}`}
                className="text-accent-blue hover:underline"
              >
                {t(messages, "footer.contact.phoneDisplay")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
