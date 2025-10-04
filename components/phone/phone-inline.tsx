"use client";

import { useCallback, useEffect, useState } from "react";

import { COUNTRIES, digitsOnly, stripOneLeadingZero, toE164 } from "./utils";

export type PhoneValue = {
  countryCode: string;
  national: string;
  e164: string;
};

type PhoneInlineFieldProps = {
  value?: PhoneValue;
  onChange?: (value: PhoneValue) => void;
  onBlur?: () => void;
  name?: string;
  ariaInvalid?: boolean;
  describedBy?: string;
};

const DEFAULT_COUNTRY_CODE = COUNTRIES[0]?.dial ?? "1";

const ensureValue = (value?: PhoneValue): PhoneValue => {
  const nextCountry = digitsOnly(value?.countryCode ?? DEFAULT_COUNTRY_CODE) || DEFAULT_COUNTRY_CODE;
  const nextNational = value?.national ?? "";

  return {
    countryCode: nextCountry,
    national: nextNational,
    e164: toE164(nextCountry, nextNational),
  };
};

export default function PhoneInlineField({
  value,
  onChange,
  onBlur,
  name,
  ariaInvalid,
  describedBy,
}: PhoneInlineFieldProps) {
  const [countryCode, setCountryCode] = useState(() => ensureValue(value).countryCode);
  const [national, setNational] = useState(() => ensureValue(value).national);

  useEffect(() => {
    const next = ensureValue(value);

    setCountryCode((prev) => (prev === next.countryCode ? prev : next.countryCode));
    setNational((prev) => (prev === next.national ? prev : next.national));
  }, [value]);

  const emitChange = useCallback(
    (nextCountry: string, nextNational: string) => {
      if (!onChange) return;
      onChange({
        countryCode: nextCountry,
        national: nextNational,
        e164: toE164(nextCountry, nextNational),
      });
    },
    [onChange]
  );

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCountry = event.target.value;
    if (nextCountry === countryCode) return;

    setCountryCode(nextCountry);
    emitChange(nextCountry, national);
  };

  const handleNationalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNational = digitsOnly(event.target.value);
    setNational(nextNational);
    emitChange(countryCode, nextNational);
  };

  const handleNationalBlur = () => {
    const normalized = stripOneLeadingZero(national);
    if (normalized !== national) {
      setNational(normalized);
      emitChange(countryCode, normalized);
    } else {
      emitChange(countryCode, national);
    }

    onBlur?.();
  };

  const preview = toE164(countryCode, national);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full rounded-2xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-cyan-500">
        <select
          name={`${name ?? "phone"}-country`}
          value={countryCode}
          onChange={handleCountryChange}
          className="min-w-[120px] px-3 py-3 bg-transparent outline-none rounded-l-2xl"
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
        >
          {COUNTRIES.map((country) => (
            <option key={`${country.iso}-${country.dial}`} value={country.dial}>
              {country.label}
            </option>
          ))}
        </select>
        <input
          name={name}
          type="tel"
          inputMode="tel"
          value={national}
          onChange={handleNationalChange}
          onBlur={handleNationalBlur}
          className="flex-1 px-3 py-3 bg-transparent outline-none rounded-r-2xl"
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
        />
      </div>
      <span className="text-xs text-brand-muted">Preview: {preview}</span>
    </div>
  );
}
