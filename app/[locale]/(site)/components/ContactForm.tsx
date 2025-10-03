"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { t, type Messages } from "@/lib/i18n";

interface ContactFormProps {
  messages: Messages;
}

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  message: string;
  company?: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  message: "",
  company: "",
};

export default function ContactForm({ messages }: ContactFormProps) {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateField = (key: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setState((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    if (!state.name.trim() || !state.email.trim() || !state.message.trim()) {
      setErrorMessage(t(messages, "form.validation.required"));
      setStatus("error");
      return;
    }

    if (state.company) {
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
          message: state.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Unexpected error");
      }

      setState(INITIAL_STATE);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t(messages, "form.error"),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-graphite-800/60 p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-body/80">
          <span>{t(messages, "contact.name")}</span>
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={updateField("name")}
            required
            className="rounded-xl border border-white/10 bg-graphite-900/80 px-4 py-3 text-body focus:border-accent-blue focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-body/80">
          <span>{t(messages, "contact.email")}</span>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={updateField("email")}
            required
            className="rounded-xl border border-white/10 bg-graphite-900/80 px-4 py-3 text-body focus:border-accent-blue focus:outline-none"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-body/80">
        <span>{t(messages, "contact.message")}</span>
        <textarea
          name="message"
          value={state.message}
          onChange={updateField("message")}
          rows={5}
          required
          className="rounded-xl border border-white/10 bg-graphite-900/80 px-4 py-3 text-body focus:border-accent-blue focus:outline-none"
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
        className="inline-flex items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-graphite-900 transition hover:scale-[1.01] focus-visible:outline"
        disabled={status === "loading"}
      >
        {status === "loading" ? t(messages, "contact.sending") : t(messages, "contact.submit")}
      </button>
      {status === "success" && (
        <p className="text-sm text-emerald-400">{t(messages, "form.success")}</p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-400">{errorMessage || t(messages, "form.error")}</p>
      )}
    </form>
  );
}
