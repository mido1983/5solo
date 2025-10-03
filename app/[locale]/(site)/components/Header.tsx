import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { SITE_NAME } from "@/lib/utils";
import { t, type Messages } from "@/lib/i18n";

import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { key: "nav.home", href: "#home" },
  { key: "nav.services", href: "#services" },
  { key: "nav.portfolio", href: "#portfolio" },
  { key: "nav.testimonials", href: "#testimonials" },
  { key: "nav.contact", href: "#contact" },
];

type HeaderProps = {
  locale: Locale;
  messages: Messages;
};

export default function Header({ locale, messages }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-graphite-900/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-6 py-4">
        <Link href={`/${locale}`} className="flex flex-col text-sm text-body/70 hover:text-body">
          <span className="text-lg font-semibold text-body">{SITE_NAME}</span>
          <span>{t(messages, "brand.tagline")}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="text-body/70 transition hover:text-accent-blue focus-visible:text-accent-blue"
            >
              {t(messages, item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
