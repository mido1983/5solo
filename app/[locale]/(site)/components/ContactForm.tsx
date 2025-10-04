"use client";

import { useState } from "react";

import { t, type Messages } from "@/lib/i18n";

const phonePattern = /^\+972\s\d{2}\s\d{2}\s\d{3}\s\d{2}$/;

type FormStatus = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  messages: Messages;
}

export default function ContactForm({ messages }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const translate = (key: string) => t(messages, key);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const form = new FormData(event.currentTarget);
    const honeypot = String(form.get("company") ?? "");
    if (honeypot) {
      return;
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !phone || !message) {
      setStatus("error");
      setErrorMessage(translate("form.required"));
      return;
    }

    if (!phonePattern.test(phone)) {
      setStatus("error");
      setErrorMessage(translate("form.phoneInvalid"));
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        let data: { error?: string } | null = null;
        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }

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

      setStatus("success");
      (event.currentTarget as HTMLFormElement).reset();
    } catch (error) {
      console.error("[contact:client:error]", error);
      setErrorMessage(translate("form.error"));
      setStatus("error");
    }
  };

  const buttonLabel = status === "sending" ? translate("form.sending") : translate("form.submit");

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-brand-line/60 bg-brand-overlay/60 p-8"
    >
      <p className="text-xs text-brand-muted">{translate("form.requiredHint")}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {translate("form.name")} <span aria-hidden>*</span>
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder={translate("form.name")}
            className="w-full rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-brand-muted">
          <span className="font-medium text-brand-foreground">
            {translate("form.email")} <span aria-hidden>*</span>
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={translate("form.email")}
            className="w-full rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {translate("form.phone")} <span aria-hidden>*</span>
        </span>
        <input
          type="tel"
          name="phone"
          required
          placeholder={translate("form.phonePlaceholder")}
          pattern="\+972\s\d{2}\s\d{2}\s\d{3}\s\d{2}"
          title="+972 12 34 567 89"
          inputMode="tel"
          className="w-full rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-brand-muted">
        <span className="font-medium text-brand-foreground">
          {translate("form.message")} <span aria-hidden>*</span>
        </span>
        <textarea
          name="message"
          required
          placeholder={translate("form.message")}
          rows={5}
          className="w-full min-h-[140px] rounded-xl border border-brand-line/60 bg-brand-base/70 px-4 py-3 text-brand-foreground placeholder:text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        />
      </label>
      <label className="hidden" aria-hidden>
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" />
      </label>
      {errorMessage && status === "error" && (
        <p className="text-sm text-accent-danger" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-brand-base shadow-glow transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:opacity-60"
        disabled={status === "sending"}
      >
        {buttonLabel}
      </button>
      <div className="text-sm" aria-live="polite" aria-atomic="true">
        {status === "success" && <p className="text-accent-success">{translate("form.success")}</p>}
      </div>
    </form>
  );
}
