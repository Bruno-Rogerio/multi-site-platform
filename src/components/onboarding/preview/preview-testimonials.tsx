"use client";

import { useState, useEffect, useCallback } from "react";
import { useWizard } from "../wizard-context";

interface PreviewTestimonialsProps {
  deviceMode: "desktop" | "mobile";
}

type Testimonial = { quote: string; author: string };

function parseTestimonials(raw: string | undefined): Testimonial[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Testimonial =>
        typeof item?.quote === "string" &&
        item.quote.trim().length > 0 &&
        typeof item?.author === "string" &&
        item.author.trim().length > 0,
    );
  } catch {
    return [];
  }
}

/* Shared style helpers */
const cardBg = "color-mix(in srgb, var(--preview-primary) 10%, transparent)";
const cardBorder = "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)";

export function PreviewTestimonials({ deviceMode }: PreviewTestimonialsProps) {
  const { state } = useWizard();
  const { content, fontFamily } = state;

  const testimonials = parseTestimonials(content.testimonialsJson);
  const variant = content.testimonialsVariant || "grid";

  // Carousel state — always declared (hooks can't be conditional)
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % Math.max(testimonials.length, 1)),
    [testimonials.length],
  );

  useEffect(() => {
    if (variant !== "carousel" || testimonials.length <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, variant, testimonials.length]);

  // Reset carousel index when testimonials change
  useEffect(() => {
    setCurrent(0);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const baseStyle = { fontFamily: fontFamily || "Inter" };

  // ── carousel ──
  if (variant === "carousel") {
    const t = testimonials[Math.min(current, testimonials.length - 1)];
    return (
      <section
        className="relative py-4 overflow-hidden"
        style={{
          ...baseStyle,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--preview-accent) 7%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-2 px-3" style={{ color: "var(--preview-text)" }}>
          Depoimentos
        </h2>
        <div className="relative px-3">
          {/* Quote card */}
          <div
            className="px-4 py-3 text-center"
            style={{
              border: cardBorder,
              backgroundColor: cardBg,
              borderRadius: "var(--preview-radius)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 10px color-mix(in srgb, var(--preview-primary) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 6%, transparent)",
            }}
          >
            <p
              className="text-[14px] leading-none mb-1"
              style={{ color: "var(--preview-accent)" }}
            >
              &ldquo;
            </p>
            <p className="text-[7px] leading-relaxed" style={{ color: "var(--preview-text)BB" }}>
              {t.quote}
            </p>
            <p className="mt-2 text-[6px] font-semibold uppercase tracking-wide" style={{ color: "var(--preview-accent)" }}>
              — {t.author}
            </p>
          </div>
          {/* Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--preview-primary) 15%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                  color: "var(--preview-text)",
                }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCurrent((i) => (i + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--preview-primary) 15%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                  color: "var(--preview-text)",
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="mt-2 flex justify-center gap-1">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className="h-1 rounded-full transition-all duration-200"
                style={{
                  width: i === current ? "12px" : "4px",
                  backgroundColor: i === current ? "var(--preview-primary)" : "color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                }}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // ── split ──
  if (variant === "split" || variant === "quotes") {
    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          ...baseStyle,
          background: "radial-gradient(ellipse 50% 60% at 0% 50%, color-mix(in srgb, var(--preview-accent) 6%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          Depoimentos
        </h2>
        <div
          className="divide-y"
          style={{ borderColor: "color-mix(in srgb, var(--preview-primary) 18%, transparent)" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`flex gap-2 ${deviceMode === "mobile" ? "flex-col" : ""} py-2`}
            >
              <div className="shrink-0" style={{ width: deviceMode === "mobile" ? "auto" : "56px" }}>
                <p className="text-[7px] font-semibold" style={{ color: "var(--preview-accent)" }}>{t.author}</p>
                <div
                  className="mt-0.5 h-[1.5px] w-4"
                  style={{ background: "linear-gradient(90deg, var(--preview-accent), transparent)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] leading-none mb-0.5" style={{ color: "var(--preview-accent)" }}>&ldquo;</p>
                <p className="text-[7px] leading-relaxed" style={{ color: "var(--preview-text)BB" }}>{t.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── grid (default) ──
  return (
    <section
      className="relative px-3 py-4 overflow-hidden"
      style={{
        ...baseStyle,
        background: "radial-gradient(ellipse 70% 55% at 100% 0%, color-mix(in srgb, var(--preview-accent) 7%, transparent), transparent)",
      }}
    >
      {/* Orb */}
      <div
        className="pointer-events-none absolute -left-3 bottom-0 h-12 w-12 rounded-full opacity-[0.10] blur-xl"
        style={{ background: "var(--preview-primary)" }}
      />
      <h2 className="relative text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        Depoimentos
      </h2>
      <div className={`relative grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-2"
            style={{
              border: cardBorder,
              backgroundColor: cardBg,
              borderRadius: "var(--preview-radius)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--preview-primary) 8%, transparent)",
            }}
          >
            {/* Decorative quote mark */}
            <p
              className="text-[10px] leading-none mb-0.5 opacity-60"
              style={{ color: "var(--preview-accent)" }}
            >
              &ldquo;
            </p>
            <p className="text-[7px] leading-relaxed italic" style={{ color: "var(--preview-text)BB" }}>
              {t.quote}
            </p>
            <div className="mt-1.5 flex items-center gap-1">
              <div
                className="h-[1.5px] w-4 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--preview-primary), var(--preview-accent))" }}
              />
              <p className="text-[6px] font-semibold uppercase tracking-wide" style={{ color: "var(--preview-accent)" }}>
                {t.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
