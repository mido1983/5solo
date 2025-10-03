import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/utils";
import { t, type Messages } from "@/lib/i18n";

import LanguageSwitcher from "./LanguageSwitcher";

type NavItem = {
  key: string;
  href: string;
  type: "anchor" | "route";
};

const NAV_ITEMS: NavItem[] = [
  { key: "nav.home", href: "#home", type: "anchor" },
  { key: "nav.services", href: "#services", type: "anchor" },
  { key: "nav.cases", href: "cases", type: "route" },
  { key: "nav.testimonials", href: "#testimonials", type: "anchor" },
  { key: "nav.contact", href: "#contact", type: "anchor" },
];

type HeaderProps = {
  locale: Locale;
  messages: Messages;
};

export default function Header({ locale, messages }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/60 bg-brand-base/85 backdrop-blur">
      <div className="container flex items-center justify-between gap-6 py-4 text-brand-foreground">
        <Link href={localePath(locale)} className="flex flex-col text-sm text-brand-muted hover:text-brand-foreground">
          <span className="text-lg font-semibold text-brand-foreground">5SOLO</span>
          <span>{t(messages, "brand.tagline")}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="main navigation">
          {NAV_ITEMS.map((item) => {
            const href = item.type === "route" ? localePath(locale, item.href) : `/${locale}${item.href}`;
            return (
              <Link
                key={item.key}
                href={href}
                className="text-brand-muted transition hover:text-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              >
                {t(messages, item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
