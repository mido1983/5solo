import type { ChangeEvent } from "react";

import { COUNTRIES } from "./phone-utils";

type CountryCodeSelectProps = {
  value: string;
  onChange: (code: string) => void;
  countries?: typeof COUNTRIES;
  id?: string;
  label?: string;
};

export function CountryCodeSelect({
  value,
  onChange,
  countries = COUNTRIES,
  id = "country-code",
  label = "Country code",
}: CountryCodeSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm text-brand-muted">
      <span className="font-medium text-brand-foreground">{label}</span>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
      >
        {countries.map((country) => (
          <option key={country.dial} value={country.dial}>
            {country.iso} +{country.dial}
          </option>
        ))}
      </select>
    </label>
  );
}
