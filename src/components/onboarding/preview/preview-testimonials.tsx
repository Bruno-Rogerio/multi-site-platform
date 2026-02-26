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
  const variant = content.testimonialsVariant || "grid";

  if (testimonials.length === 0) return null;

  const baseStyle = { fontFamily: fontFamily || "Inter" };

  // ── carousel ──
  if (variant === "carousel") {
    return (
      <section className="py-4 overflow-hidden" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-2 px-3" style={{ color: "var(--preview-text)" }}>
          Depoimentos
        </h2>
        <div
          className="flex overflow-x-auto gap-2 px-3 pb-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="shrink-0 snap-center border p-2.5 w-[80%]"
              style={{
                borderColor: "var(--preview-text)12",
                backgroundColor: "var(--preview-text)04",
                borderRadius: "var(--preview-radius)",
              }}
            >
              <p className="text-[14px] leading-none mb-1" style={{ color: "var(--preview-accent)" }}>&ldquo;</p>
              <p className="text-[7px] leading-relaxed" style={{ color: "var(--preview-text)BB" }}>
                {t.quote}
              </p>
              <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-wide" style={{ color: "var(--preview-accent)" }}>
                — {t.author}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: i === 0 ? "var(--preview-primary)" : "var(--preview-text)20" }}
            />
          ))}
        </div>
      </section>
    );
  }

  // ── quotes ──
  if (variant === "quotes") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3 text-center" style={{ color: "var(--preview-text)" }}>
          Depoimentos
        </h2>
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="text-center"
              style={i > 0 ? { borderTop: "1px solid var(--preview-text)12", paddingTop: "12px" } : {}}
            >
              <p className="text-[18px] leading-none mb-1" style={{ color: "var(--preview-accent)" }}>&ldquo;</p>
              <p className="text-[8px] leading-relaxed italic" style={{ color: "var(--preview-text)BB" }}>
                {t.quote}
              </p>
              <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-widest" style={{ color: "var(--preview-accent)" }}>
                {t.author}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── grid (default) ──
  return (
    <section className="px-3 py-4" style={baseStyle}>
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
