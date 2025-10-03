import { t, type Messages } from "@/lib/i18n";

const TESTIMONIAL_IDS = ["client1", "client2", "client3"] as const;

interface TestimonialsProps {
  messages: Messages;
}

export default function Testimonials({ messages }: TestimonialsProps) {
  return (
    <section id="testimonials" className="bg-brand-surface/60 py-20">
      <div className="container space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{t(messages, "testimonials.label")}</p>
          <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{t(messages, "testimonials.title")}</h2>
          <p className="mx-auto max-w-3xl text-brand-muted">{t(messages, "testimonials.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIAL_IDS.map((id) => (
            <figure
              key={id}
              className="flex h-full flex-col justify-between rounded-3xl border border-brand-line/60 bg-brand-base/80 p-6"
            >
              <blockquote className="text-brand-muted">
                <p>“{t(messages, `testimonials.items.${id}.quote`)}”</p>
              </blockquote>
              <figcaption className="mt-6 text-sm font-semibold text-accent-secondary">
                {t(messages, `testimonials.items.${id}.name`)}
                <span className="block text-xs font-normal text-brand-muted">
                  {t(messages, `testimonials.items.${id}.role`)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
