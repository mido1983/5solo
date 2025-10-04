"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { PhoneField, type PhonePayload } from "@/components/phone/PhoneField";
import { t, type Messages } from "@/lib/i18n";

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  phone: PhonePayload;
  company?: string;
};

type FormStatus = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  messages: Messages;
}

const DEFAULT_PHONE: PhonePayload = {
  countryCode: "972",
  national: "",
  e164: "+972",
};

export default function ContactForm({ messages }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: DEFAULT_PHONE,
      company: "",
    },
  });

  const translate = (key: string) => t(messages, key);

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("sending");
    setErrorMessage("");

    const { phone } = values;
    const nationalLength = phone.national.length;

    if (nationalLength < 7 || nationalLength > 15) {
      setStatus("error");
      setErrorMessage(translate("form.phoneInvalid"));
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      message: values.message,
      phone_e164: phone.e164,
      phone_country_code: phone.countryCode,
      phone_national: phone.national,
      company: values.company ?? "",
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
        if (data?.error === "PHONE_INVALID") {
          setErrorMessage(translate("form.phoneInvalid"));
        } else if (data?.error === "MISSING_FIELDS") {
          setErrorMessage(translate("form.required"));
        } else {
          setErrorMessage(translate("form.tryAgain"));
        }
        setStatus("error");
        return;
      }

      reset({
        name: "",
        email: "",
        message: "",
        phone: DEFAULT_PHONE,
        company: "",
      });
      setStatus("success");
    } catch (error) {
      console.error("[contact:client:error]", error);
      setErrorMessage(translate("form.error"));
      setStatus("error");
    }
  };

  const buttonLabel = isSubmitting || status === "sending" ? translate("form.sending") : translate("form.submit");

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
            {...register("name", { required: translate("form.required") })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
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
              required: translate("form.required"),
              pattern: {
                value: /.+@.+\..+/, // basic validation
                message: translate("form.required"),
              },
            })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
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
          required: translate("form.required"),
          validate: (value) => {
            const length = value?.national?.length ?? 0;
            if (!length) {
              return translate("form.required");
            }
            if (length < 7 || length > 15) {
              return translate("form.phoneInvalid");
            }
            return true;
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <PhoneField
            value={value}
            onChange={onChange}
            error={error?.message}
            label={translate("form.phone")}
            placeholder={translate("form.phonePlaceholder")}
            countryLabel={translate("form.countryCode")}
          />
        )}
      />
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {translate("form.message")} <span aria-hidden>*</span>
        </span>
        <textarea
          rows={5}
          {...register("message", { required: translate("form.required") })}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full min-h-[140px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          placeholder={translate("form.message")}
        />
        {errors.message && (
          <span id="message-error" className="text-sm text-accent-danger">
            {errors.message.message}
          </span>
        )}
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />
      {errorMessage && status === "error" && (
        <p className="text-sm text-accent-danger" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:opacity-60"
        disabled={isSubmitting || status === "sending"}
      >
        {buttonLabel}
      </button>
      {status === "success" && (
        <p className="text-sm text-accent-success" role="status">
          {translate("form.success")}
        </p>
      )}
    </form>
  );
}
