export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

export function stripOneLeadingZero(value: string): string {
  if (value.startsWith("0")) {
    return value.slice(1);
  }
  return value;
}

export function toE164(countryCode: string, national: string): string {
  return `+${countryCode}${national}`;
}

export type CountryOption = {
  iso: string;
  dial: string;
  label: string;
};

export const COUNTRIES: CountryOption[] = [
  { iso: "IL", dial: "972", label: "IL +972" },
  { iso: "US", dial: "1", label: "US +1" },
  { iso: "RU", dial: "7", label: "RU +7" },
  { iso: "GE", dial: "995", label: "GE +995" },
  { iso: "RS", dial: "381", label: "RS +381" },
  { iso: "UA", dial: "380", label: "UA +380" },
  { iso: "DE", dial: "49", label: "DE +49" },
  { iso: "FR", dial: "33", label: "FR +33" },
  { iso: "GB", dial: "44", label: "GB +44" },
  { iso: "ES", dial: "34", label: "ES +34" },
  { iso: "IT", dial: "39", label: "IT +39" },
];
