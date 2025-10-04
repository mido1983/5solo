"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import TurnstileWidget from "@/components/anti-spam/TurnstileWidget";
import PhoneInlineField, { type PhoneValue } from "@/components/phone/phone-inline";
import { digitsOnly, stripOneLeadingZero, toE164 } from "@/components/phone/utils";
import { t, type Messages } from "@/lib/i18n";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  phone: PhoneValue;
  website: string;
  ts: string;
  turnstileToken: string;
};

type FormStatus = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  messages: Messages;
}

const DEFAULT_COUNTRY = "972";
const DEFAULT_PHONE: PhoneValue = {
  countryCode: DEFAULT_COUNTRY,
  national: "",
  e164: toE164(DEFAULT_COUNTRY, ""),
};

const clampPhoneValue = (value?: PhoneValue): PhoneValue => {
  const nextCountry = digitsOnly(value?.countryCode ?? DEFAULT_PHONE.countryCode) || DEFAULT_PHONE.countryCode;
  const nextNationalDigits = digitsOnly(value?.national ?? "");

  return {
    countryCode: nextCountry,
    national: nextNationalDigits,
    e164: toE164(nextCountry, nextNationalDigits),
  };
};

export default function ContactForm({ messages }: ContactFormProps) {
  // To reuse this form elsewhere, supply localized messages and configure Turnstile keys in the environment.
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string>("");
  const [captchaRefresh, setCaptchaRefresh] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: DEFAULT_PHONE,
      website: "",
      ts: Date.now().toString(),
      turnstileToken: "",
    },
  });

  const translate = (key: string) => t(messages, key);
  const withFallback = (key: string, fallback: string) => {
    const value = translate(key);
    return value && value.length > 0 ? value : fallback;
  };

  const captchaRequiredMessage = withFallback("form.captchaRequired", "Подтвердите, что вы не бот");
  const tooFastMessage = withFallback("form.tooFast", "Слишком быстрое отправление");
  const suspiciousMessage = withFallback("form.suspicious", "Подозрительная активность");
  const phoneInvalidMessage = withFallback("form.phoneInvalid", "Неверный номер телефона");
  const requiredMessage = withFallback("form.required", "Обязательное поле");
  const tryAgainMessage = withFallback("form.tryAgain", "Попробуйте снова позже");

  const turnstileToken = watch("turnstileToken");
  const isSending = isSubmitting || status === "sending";

  const handleTurnstileVerify = (token: string) => {
    setValue("turnstileToken", token, { shouldValidate: true });
    clearErrors("turnstileToken");
    setFormError("");
  };

  const handleTurnstileExpire = () => {
    setValue("turnstileToken", "", { shouldValidate: true });
    setError("turnstileToken", { type: "manual", message: captchaRequiredMessage });
  };

  const handleTurnstileError = () => {
    setValue("turnstileToken", "", { shouldValidate: true });
    setError("turnstileToken", { type: "manual", message: captchaRequiredMessage });
  };

  const onSubmit = async (values: ContactFormValues) => {
    if (!values.turnstileToken) {
      setError("turnstileToken", { type: "manual", message: captchaRequiredMessage });
      setStatus("error");
      return;
    }

    setStatus("sending");
    setFormError("");

    const phoneSanitized = clampPhoneValue({
      countryCode: values.phone?.countryCode,
      national: stripOneLeadingZero(values.phone?.national ?? ""),
      e164: values.phone?.e164 ?? "",
    });
    const nationalLength = phoneSanitized.national.length;

    if (nationalLength < 7 || nationalLength > 15) {
      setStatus("error");
      setError("phone", { type: "manual", message: phoneInvalidMessage });
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      message: values.message,
      phone_e164: phoneSanitized.e164,
      phone_country_code: phoneSanitized.countryCode,
      phone_national: phoneSanitized.national,
      website: values.website,
      ts: values.ts,
      turnstileToken: values.turnstileToken,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorCode = typeof data?.error === "string" ? data.error : "unknown";

        switch (errorCode) {
          case "honeypot":
            setFormError(suspiciousMessage);
            break;
          case "too_fast":
            setFormError(tooFastMessage);
            break;
          case "captcha_failed":
            setError("turnstileToken", { type: "server", message: captchaRequiredMessage });
            setValue("turnstileToken", "", { shouldValidate: true });
            setCaptchaRefresh((key) => key + 1);
            break;
          case "missing_fields":
            setFormError(requiredMessage);
            break;
          case "phone_invalid":
            setFormError(phoneInvalidMessage);
            break;
          default:
            setFormError(tryAgainMessage);
            break;
        }

        setStatus("error");
        return;
      }

      reset({
        name: "",
        email: "",
        message: "",
        phone: DEFAULT_PHONE,
        website: "",
        ts: Date.now().toString(),
        turnstileToken: "",
      });
      setCaptchaRefresh((key) => key + 1);
      setFormError("");
      setStatus("success");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[contact:client:error]", error);
      }
      setFormError(tryAgainMessage);
      setStatus("error");
    }
  };

  const buttonLabel = isSending ? translate("form.sending") : translate("form.submit");
  const focusOutline =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-brand-line/60 bg-brand-overlay/60 p-8"
      noValidate
    >
      <p className="text-xs text-brand-muted">{translate("form.requiredHint")}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {translate("form.name")} <span aria-hidden>*</span>
          </span>
          <input
            type="text"
            autoComplete="name"
            {...register("name", { required: requiredMessage })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted ${focusOutline}`}
            placeholder={translate("form.name")}
          />
          {errors.name && (
            <span id="name-error" className="text-sm text-accent-danger">
              {errors.name.message}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {translate("form.email")} <span aria-hidden>*</span>
          </span>
          <input
            type="email"
            autoComplete="email"
            {...register("email", {
              required: requiredMessage,
              pattern: {
                value: /.+@.+\..+/, // basic validation
                message: requiredMessage,
              },
            })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted ${focusOutline}`}
            placeholder={translate("form.email")}
          />
          {errors.email && (
            <span id="email-error" className="text-sm text-accent-danger">
              {errors.email.message}
            </span>
          )}
        </label>
      </div>
      <Controller
        name="phone"
        control={control}
        rules={{
          required: requiredMessage,
          validate: (value) => {
            const sanitized = clampPhoneValue({
              countryCode: value?.countryCode,
              national: stripOneLeadingZero(value?.national ?? ""),
              e164: value?.e164 ?? "",
            });
            const length = sanitized.national.length;
            if (!length) {
              return requiredMessage;
            }
            if (length < 7 || length > 15) {
              return phoneInvalidMessage;
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message;
          const describedBy = error ? "phone-error" : undefined;

          const handleFieldChange = (nextValue: PhoneValue) => {
            const countryCode = digitsOnly(nextValue.countryCode) || DEFAULT_PHONE.countryCode;
            const nationalDigits = digitsOnly(nextValue.national);
            field.onChange({
              countryCode,
              national: nationalDigits,
              e164: toE164(countryCode, nationalDigits),
            });
          };

          const handleFieldBlur = () => {
            const currentCountry =
              digitsOnly(field.value?.countryCode ?? DEFAULT_PHONE.countryCode) || DEFAULT_PHONE.countryCode;
            const normalizedNational = stripOneLeadingZero(digitsOnly(field.value?.national ?? ""));
            field.onChange({
              countryCode: currentCountry,
              national: normalizedNational,
              e164: toE164(currentCountry, normalizedNational),
            });
            field.onBlur();
          };

          return (
            <label className="flex flex-col gap-2 text-sm text-brand-muted">
              <span className="font-medium text-brand-foreground">
                {translate("form.phone")} <span aria-hidden>*</span>
              </span>
              <PhoneInlineField
                value={field.value}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                name={field.name}
                ariaInvalid={Boolean(error)}
                describedBy={describedBy}
              />
              {error && (
                <span id="phone-error" className="text-sm text-accent-danger" role="alert">
                  {error}
                </span>
              )}
            </label>
          );
        }}
      />
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {translate("form.message")} <span aria-hidden>*</span>
        </span>
        <textarea
          rows={5}
          {...register("message", { required: requiredMessage })}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full min-h-[140px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted ${focusOutline}`}
          placeholder={translate("form.message")}
        />
        {errors.message && (
          <span id="message-error" className="text-sm text-accent-danger">
            {errors.message.message}
          </span>
        )}
      </label>
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        style={{ display: "none" }}
        {...register("website")}
        autoComplete="off"
      />
      <input type="hidden" {...register("ts")} />
      <input type="hidden" {...register("turnstileToken")} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <TurnstileWidget
          key={captchaRefresh}
          siteKey={siteKey}
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
          onError={handleTurnstileError}
          className="min-h-[70px]"
        />
      </div>
      <button
        type="submit"
        className={`inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.01] disabled:opacity-60 ${focusOutline}`}
        disabled={isSending || !turnstileToken}
        aria-busy={isSending}
      >
        {isSending && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-brand-base"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {buttonLabel}
      </button>
      {(errors.turnstileToken || formError) && (
        <p className="text-sm text-accent-danger" role="alert" aria-live="polite">
          {errors.turnstileToken?.message ?? formError}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-accent-success" role="status" aria-live="polite">
          {translate("form.success")}
        </p>
      )}
    </form>
  );
}
