import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { SITE_NAME } from "@/lib/utils";
import { t, type Messages } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  messages: Messages;
};

const POLICY_LINKS = [
  { key: "footer.links.privacy", href: "#" },
  { key: "footer.links.terms", href: "#" },
];

export default function Footer({ locale, messages }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-graphite-900/90">
      <div className="container mx-auto flex flex-col gap-8 py-10 text-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-body">{SITE_NAME}</h2>
            <p className="text-body/70">{t(messages, "footer.tagline")}</p>
          </div>
          <div className="flex flex-col gap-2 text-body/70 md:text-right">
            <a className="hover:text-body" href={`mailto:${t(messages, "footer.contact.email")}`}>
              {t(messages, "footer.contact.email")}
            </a>
            <a className="hover:text-body" href={`tel:${t(messages, "footer.contact.phoneLink")}`}>
              {t(messages, "footer.contact.phoneDisplay")}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/5 pt-6 text-body/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} {SITE_NAME}. {t(messages, "footer.rights")}</p>
          <nav className="flex items-center gap-4" aria-label="footer">
            {POLICY_LINKS.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}`}
                className="hover:text-body focus-visible:text-body"
              >
                {t(messages, item.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
