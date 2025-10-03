"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { locales, type Locale } from "@/i18n/locales";
import { replaceLocaleInPathname } from "@/lib/utils";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

type LanguageSwitcherProps = {
  locale: Locale;
};

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) {
      return;
    }

    const nextPath = replaceLocaleInPathname(pathname, nextLocale);
    const serializedParams = searchParams.toString();
    const qs = serializedParams ? `?${serializedParams}` : "";

    startTransition(() => {
      setLocaleCookie(nextLocale);
      setCurrentLocale(nextLocale);
      router.push(`${nextPath}${qs}`);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-brand-overlay/70 p-1 text-[0.7rem] uppercase text-brand-muted">
      {locales.map((item) => {
        const isActive = item === currentLocale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => handleSelect(item)}
            aria-pressed={isActive}
            disabled={isActive || isPending}
            className={clsx(
              "rounded-full px-2 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
              isActive
                ? "bg-accent-primary text-brand-base shadow-glow"
                : "text-brand-muted hover:text-brand-foreground"
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
