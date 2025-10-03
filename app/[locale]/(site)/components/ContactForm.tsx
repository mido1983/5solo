"use client";

import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { t, type Messages } from "@/lib/i18n";

interface ContactFormProps {
  messages: Messages;
}

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
};

const EMAIL_REGEX = /.+@.+\..+/;

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  company: "",
};

export default function ContactForm({ messages }: ContactFormProps) {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const labels = useMemo(
    () => ({
      requiredHint: t(messages, "contact.requiredHint"),
      phoneOptional: t(messages, "contact.phoneOptional"),
      status: {
        idle: t(messages, "contact.status.idle"),
        sending: t(messages, "contact.status.sending"),
        success: t(messages, "contact.status.success"),
        error: t(messages, "contact.status.error"),
      },
      validation: {
        required: t(messages, "contact.validation.required"),
        email: t(messages, "contact.validation.email"),
        phone: t(messages, "contact.validation.phone"),
      },
    }),
    [messages],
  );

  const updateField = (key: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setState((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formatter = new AsYouType();
    const formatted = formatter.input(event.target.value);
    setState((prev) => ({ ...prev, phone: formatted }));
  };

  const validate = (): string | null => {
    if (!state.name.trim() || !state.email.trim() || !state.message.trim()) {
      return labels.validation.required;
    }

    if (!EMAIL_REGEX.test(state.email.trim())) {
      return labels.validation.email;
    }

    const phoneValue = state.phone.trim();
    if (phoneValue) {
      const parsed = parsePhoneNumberFromString(phoneValue);
      if (!parsed || !parsed.isValid()) {
        return labels.validation.phone;
      }
    }

    if (state.company) {
      return "";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    const validationError = validate();
    if (validationError) {
      if (validationError.length === 0) {
        return;
      }
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name.trim(),
          email: state.email.trim(),
          phone: state.phone.trim(),
          message: state.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? labels.status.error);
      }

      setState(INITIAL_STATE);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : labels.status.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-brand-line/60 bg-brand-overlay/60 p-8"
    >
      <p className="text-xs text-brand-muted">{labels.requiredHint}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {t(messages, "contact.name")} <span aria-hidden>*</span>
          </span>
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={updateField("name")}
            required
            className="rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {t(messages, "contact.email")} <span aria-hidden>*</span>
          </span>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={updateField("email")}
            required
            className="rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {t(messages, "contact.phone")} <span className="text-brand-muted" aria-hidden>{` ${labels.phoneOptional}`}</span>
        </span>
        <input
          type="tel"
          name="phone"
          value={state.phone}
          onChange={handlePhoneChange}
          placeholder={t(messages, "contact.phonePlaceholder")}
          inputMode="tel"
          className="rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {t(messages, "contact.message")} <span aria-hidden>*</span>
        </span>
        <textarea
          name="message"
          value={state.message}
          onChange={updateField("message")}
          rows={5}
          required
          className="rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        />
      </label>
      <label className="hidden" aria-hidden>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={state.company}
          onChange={updateField("company")}
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? labels.status.sending : labels.status.idle}
      </button>
      <div className="text-sm" aria-live="polite" aria-atomic="true">
        {status === "success" && <p className="text-accent-success">{labels.status.success}</p>}
        {status === "error" && errorMessage && <p className="text-accent-danger">{errorMessage}</p>}
      </div>
    </form>
  );
}
