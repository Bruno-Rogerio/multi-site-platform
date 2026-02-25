"use client";

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

export function PreviewTestimonials({ deviceMode }: PreviewTestimonialsProps) {
  const { state } = useWizard();
  const { content, fontFamily } = state;

  const testimonials = parseTestimonials(content.testimonialsJson);

  if (testimonials.length === 0) return null;

  return (
    <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        Depoimentos
      </h2>
      <div className={`grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="border p-2"
            style={{
              borderColor: "var(--preview-text)12",
              backgroundColor: "var(--preview-text)04",
              borderRadius: "var(--preview-radius)",
            }}
          >
            <p className="text-[7px] leading-relaxed italic" style={{ color: "var(--preview-text)BB" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-wide" style={{ color: "var(--preview-accent)" }}>
              {t.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
