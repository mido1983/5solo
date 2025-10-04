import { digitsOnly, normalizeNational } from "./phone-utils";

type NationalNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  id?: string;
  label?: string;
};

export function NationalNumberInput({
  value,
  onChange,
  onBlur,
  placeholder = "",
  error,
  id = "national-number",
  label = "Номер",
}: NationalNumberInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = digitsOnly(event.target.value);
    onChange(filtered);
  };

  const handleBlur = () => {
    const normalised = normalizeNational(value);
    if (normalised !== value) {
      onChange(normalised);
    }
    onBlur?.();
  };

  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm text-brand-muted">
      <span className="font-medium text-brand-foreground">
        {label} <span aria-hidden>*</span>
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
      />
      {error && (
        <span id={`${id}-error`} className="text-sm text-accent-danger">
          {error}
        </span>
      )}
    </label>
  );
}
