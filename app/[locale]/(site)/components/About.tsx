import { t, type Messages } from "@/lib/i18n";

interface AboutProps {
  messages: Messages;
}

export default function About({ messages }: AboutProps) {
  return (
    <section id="about" className="border-t border-brand-line/60 bg-brand-base py-20">
      <div className="container grid gap-10 md:grid-cols-[2fr,3fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{t(messages, "about.label")}</p>
          <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{t(messages, "about.title")}</h2>
        </div>
        <p className="text-lg leading-relaxed text-brand-muted">{t(messages, "about.text")}</p>
      </div>
    </section>
  );
}
