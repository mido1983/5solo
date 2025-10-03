import type { Locale } from "@/i18n/locales";

type MessageValue = string | { [key: string]: MessageValue };

export type Messages = Record<string, MessageValue>;

export async function getMessages(locale: Locale): Promise<Messages> {
  const dictionary = (await import(`@/i18n/messages/${locale}.json`)) as { default: Messages };
  return dictionary.default;
}

function resolve(messages: MessageValue | undefined, segments: string[]): string | undefined {
  if (typeof messages === "string") {
    return segments.length === 0 ? messages : undefined;
  }

  if (!messages) {
    return undefined;
  }

  const [current, ...rest] = segments;
  if (!current) {
    return undefined;
  }

  return resolve((messages as Record<string, MessageValue>)[current], rest);
}

export function t(messages: Messages, key: string, fallback?: string): string {
  const segments = key.split(".");
  const result = resolve(messages, segments);

  if (typeof result === "string") {
    return result;
  }

  return fallback ?? key;
}
