import { t, type Messages } from "@/lib/i18n";

interface AboutProps {
  messages: Messages;
}

export default function About({ messages }: AboutProps) {
  return (
    <section id="about" className="border-t border-white/5 bg-graphite-900 py-20">
      <div className="container mx-auto grid gap-10 md:grid-cols-[2fr,3fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-accent-gold">{t(messages, "about.label")}</p>
          <h2 className="text-3xl font-semibold text-body md:text-4xl">{t(messages, "about.title")}</h2>
        </div>
        <p className="text-lg leading-relaxed text-body/70">{t(messages, "about.text")}</p>
      </div>
    </section>
  );
}
