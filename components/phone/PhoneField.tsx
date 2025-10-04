import { useEffect, useMemo, useState } from "react";

import { CountryCodeSelect } from "./CountryCodeSelect";
import { NationalNumberInput } from "./NationalNumberInput";
import { COUNTRIES, normalizeNational, toE164 } from "./phone-utils";

export type PhonePayload = {
  countryCode: string;
  national: string;
  e164: string;
};

type PhoneFieldProps = {
  value?: PhonePayload;
  onChange: (payload: PhonePayload) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  countryLabel?: string;
};

const DEFAULT_COUNTRY = COUNTRIES[0]?.dial ?? "972";

export function PhoneField({
  value,
  onChange,
  error,
  label = "Phone",
  placeholder = "123456789",
  countryLabel = "Country code",
}: PhoneFieldProps) {
  const [countryCode, setCountryCode] = useState<string>(value?.countryCode ?? DEFAULT_COUNTRY);
  const [national, setNational] = useState<string>(value?.national ?? "");

  useEffect(() => {
    if (value?.countryCode && value.countryCode !== countryCode) {
      setCountryCode(value.countryCode);
    }
    if (typeof value?.national === "string" && value.national !== national) {
      setNational(value.national);
    }
  }, [value?.countryCode, value?.national, countryCode, national]);

  const payload = useMemo<PhonePayload>(() => {
    const normalised = normalizeNational(national);
    const e164 = toE164(countryCode, normalised);
    return {
      countryCode,
      national: normalised,
      e164,
    };
  }, [countryCode, national]);

  useEffect(() => {
    onChange(payload);
  }, [payload, onChange]);

  return (
    <div className="space-y-4" aria-live="polite">
      <CountryCodeSelect value={countryCode} onChange={setCountryCode} label={countryLabel} />
      <NationalNumberInput
        value={national}
        onChange={setNational}
        placeholder={placeholder}
        error={error}
        label={label}
      />
      <p className="text-xs text-brand-muted">
        Preview: <span className="font-mono text-brand-foreground">{payload.e164}</span>
      </p>
    </div>
  );
}
