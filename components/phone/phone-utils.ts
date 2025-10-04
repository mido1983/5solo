export type PhoneValue = {
  countryCode: string;
  national: string;
  e164: string;
};

/** Return digits only from a given string. */
export function digitsOnly(input: string): string {
  return input.replace(/\D+/g, "");
}

/**
 * Normalise national number: keep digits only and remove a single leading zero if present.
 */
export function normalizeNational(input: string): string {
  const digits = digitsOnly(input);
  if (digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/** Compose the E.164 representation using country code and national number. */
export function toE164(countryCode: string, national: string): string {
  return `+${countryCode}${national}`;
}

export const COUNTRIES: { iso: string; name: string; dial: string }[] = [
  { iso: "IL", name: "Israel", dial: "972" },
  { iso: "US", name: "United States", dial: "1" },
  { iso: "RU", name: "Russia", dial: "7" },
  { iso: "GE", name: "Georgia", dial: "995" },
  { iso: "RS", name: "Serbia", dial: "381" },
  { iso: "UA", name: "Ukraine", dial: "380" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "ES", name: "Spain", dial: "34" },
  { iso: "IT", name: "Italy", dial: "39" },
];
