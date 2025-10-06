import TestimonialsCarousel, { type Testimonial } from "@/components/TestimonialsCarousel";
import { t, type Messages } from "@/lib/i18n";

interface TestimonialsProps {
  messages: Messages;
}

type TestimonialsBlock = Record<string, unknown>;

type Controls = {
  prev: string;
  next: string;
  goto: string;
};

function getTestimonialsBlock(messages: Messages): TestimonialsBlock | undefined {
  const value = (messages as Record<string, unknown>)["testimonials"];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as TestimonialsBlock;
  }
  return undefined;
}

function extractItems(block: TestimonialsBlock | undefined): Testimonial[] {
  if (!block) {
    return [];
  }

  const rawItems = block["items"] as unknown;
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const record = item as Record<string, unknown>;
      const quote = typeof record.quote === "string" ? record.quote.trim() : "";
      const name = typeof record.name === "string" ? record.name.trim() : "";
      if (!quote || !name) {
        return null;
      }
      return {
        id: typeof record.id === "string" ? record.id : `testimonial-${index + 1}`,
        quote,
        name,
        role: typeof record.role === "string" ? record.role.trim() : undefined,
        avatarUrl: typeof record.avatarUrl === "string" ? record.avatarUrl : undefined,
      } satisfies Testimonial;
    })
    .filter((item): item is Testimonial => Boolean(item));
}

function extractControls(block: TestimonialsBlock | undefined): Controls {
  const controlsValue = block?.["controls"];
  if (!controlsValue || typeof controlsValue !== "object") {
    return {
      prev: "Previous",
      next: "Next",
      goto: "Go to testimonial",
    };
  }

  const record = controlsValue as Record<string, unknown>;
  return {
    prev: typeof record.prev === "string" ? record.prev : "Previous",
    next: typeof record.next === "string" ? record.next : "Next",
    goto: typeof record.goto === "string" ? record.goto : "Go to testimonial",
  };
}

export default function Testimonials({ messages }: TestimonialsProps) {
  const block = getTestimonialsBlock(messages);
  const items = extractItems(block);
  const controls = extractControls(block);

  return (
    <section id="testimonials" className="bg-brand-surface/60 py-20">
      <div className="container space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-secondary">{t(messages, "testimonials.label")}</p>
          <h2 className="text-3xl font-semibold text-brand-foreground md:text-4xl">{t(messages, "testimonials.title")}</h2>
          <p className="mx-auto max-w-3xl text-brand-muted">{t(messages, "testimonials.subtitle")}</p>
        </div>
        {items.length > 0 && (
          <TestimonialsCarousel
            items={items}
            ariaLabel={t(messages, "testimonials.title")}
            previousLabel={controls.prev}
            nextLabel={controls.next}
            bulletLabel={controls.goto}
          />
        )}
      </div>
    </section>
  );
}
