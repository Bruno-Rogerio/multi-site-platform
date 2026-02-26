"use client";

import { useState, useEffect, useCallback } from "react";

type Testimonial = { quote: string; author: string };

const containerClass = "mx-auto w-full max-w-6xl px-6";

export function TestimonialsCarousel({
  title,
  testimonials,
  cardRadius,
}: {
  title: string;
  testimonials: Testimonial[];
  cardRadius: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % testimonials.length),
    [testimonials.length],
  );
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length),
    [testimonials.length],
  );

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused, testimonials.length]);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="w-full py-16 md:py-20">
      <div className={containerClass}>
        <h2 className="text-3xl font-bold text-center">{title}</h2>

        <div
          className="relative mt-10 max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arrow — prev */}
          {testimonials.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-background)] text-lg opacity-50 transition hover:opacity-100"
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          {/* Quote card */}
          <div
            className="border border-[var(--site-border)] bg-[var(--site-surface)] px-10 py-10 text-center transition-all duration-300"
            style={{ borderRadius: cardRadius }}
          >
            <p className="text-4xl font-serif leading-none text-[var(--site-accent)] mb-4">&ldquo;</p>
            <p className="text-lg md:text-xl leading-relaxed opacity-80">{t.quote}</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[var(--site-accent)]">
              — {t.author}
            </p>
          </div>

          {/* Arrow — next */}
          {testimonials.length > 1 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-background)] text-lg opacity-50 transition hover:opacity-100"
              aria-label="Próximo"
            >
              ›
            </button>
          )}

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "8px",
                    backgroundColor: i === current ? "var(--site-primary)" : "var(--site-border)",
                  }}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
