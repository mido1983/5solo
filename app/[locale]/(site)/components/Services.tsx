import Image from "next/image";

import { t, type Messages } from "@/lib/i18n";

interface ServicesProps {
  messages: Messages;
}

const ITEMS = ["dev", "design", "seo", "media", "care"] as const;

export default function Services({ messages }: ServicesProps) {
  return (
    <section id="services" className="bg-graphite-800/60 py-20">
      <div className="container mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-widest text-accent-gold">{t(messages, "services.label")}</p>
          <h2 className="text-3xl font-semibold text-body md:text-4xl">{t(messages, "services.title")}</h2>
          <p className="mx-auto max-w-2xl text-body/70">{t(messages, "services.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-graphite-900 to-graphite-800 p-6 transition hover:border-accent-blue/60"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <Image
                  src={`/images/portfolio/icon-${item}.svg`}
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-80"
                />
              </div>
              <h3 className="text-xl font-semibold text-body">{t(messages, `services.items.${item}.title`)}</h3>
              <p className="mt-3 text-body/70">{t(messages, `services.items.${item}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
