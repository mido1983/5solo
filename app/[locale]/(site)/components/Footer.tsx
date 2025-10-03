import Link from "next/link";

import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/utils";
import { t, type Messages } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  messages: Messages;
};

const FOOTER_LINK_KEYS = [
  { key: "footer.links.privacy", path: "legal/privacy" },
  { key: "footer.links.terms", path: "legal/terms" },
];

export default function Footer({ locale, messages }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-line/60 bg-brand-base">
      <div className="container flex flex-col gap-8 py-10 text-sm text-brand-muted">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-brand-foreground">5SOLO</h2>
            <p>{t(messages, "footer.tagline")}</p>
          </div>
          <nav className="flex items-center gap-4" aria-label="legal">
            {FOOTER_LINK_KEYS.map((item) => (
              <Link
                key={item.key}
                href={localePath(locale, item.path)}
                className="text-brand-muted transition hover:text-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              >
                {t(messages, item.key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-brand-line/60 pt-6 text-xs text-brand-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} 5SOLO. {t(messages, "footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
