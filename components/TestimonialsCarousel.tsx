"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  avatarUrl?: string;
};

const AUTOPLAY_INTERVAL = 7000;
const SWIPE_THRESHOLD_PX = 48;

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "??";
};

export default function TestimonialsCarousel({
  items,
  ariaLabel = "Testimonials",
  previousLabel = "Previous",
  nextLabel = "Next",
  bulletLabel = "Go to testimonial",
}: {
  items: Testimonial[];
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  bulletLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const pointerStart = useRef<number | null>(null);
  const pointerDelta = useRef(0);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      const next = (index + total) % total;
      setActiveIndex(next);
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    if (isPaused) return;

    autoplayRef.current = setTimeout(goNext, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [activeIndex, goNext, isPaused, total]);

  useEffect(() => {
    const node = slideRefs.current[activeIndex];
    node?.focus({ preventScroll: true });
  }, [activeIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    pointerDelta.current = 0;
    setIsPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    pointerDelta.current = event.clientX - pointerStart.current;
  };

  const releaseSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const delta = pointerDelta.current;
    pointerStart.current = null;
    pointerDelta.current = 0;
    setIsPaused(false);

    if (delta > SWIPE_THRESHOLD_PX) {
      goPrev();
    } else if (delta < -SWIPE_THRESHOLD_PX) {
      goNext();
    }
  };

  if (total === 0) {
    return null;
  }

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className="overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releaseSwipe}
        onPointerCancel={releaseSwipe}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {items.map((testimonial, index) => {
            const initials = getInitials(testimonial.name);
            return (
              <div
                key={testimonial.id}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${total}`}
                tabIndex={-1}
                className="min-w-full shrink-0 px-2 outline-none"
              >
                <article className="flex h-full flex-col justify-between rounded-2xl bg-brand-base/70 p-6 backdrop-blur">
                  <div className="flex items-start gap-4">
                    {testimonial.avatarUrl ? (
                      <Image
                        src={testimonial.avatarUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-semibold uppercase text-white">
                        {initials}
                      </div>
                    )}
                    <p className="text-base leading-relaxed text-white/90">{testimonial.quote}</p>
                  </div>
                  <footer className="mt-6 border-t border-white/10 pt-4 text-sm text-white/70">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    {testimonial.role && <p>{testimonial.role}</p>}
                  </footer>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {total > 1 && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              aria-label={previousLabel}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-cyan-400"
            >
              {previousLabel}
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={nextLabel}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-cyan-400"
            >
              {nextLabel}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {items.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                aria-label={`${bulletLabel} ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition focus:outline-none focus-visible:ring focus-visible:ring-cyan-400 ${
                  index === activeIndex ? "w-8 bg-cyan-400" : "w-2.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export type { Testimonial };
