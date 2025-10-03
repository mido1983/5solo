export const locales = ["he", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const rtlLocales = new Set<Locale>(["he"]);

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const isRtl = (locale: Locale): boolean => rtlLocales.has(locale);

