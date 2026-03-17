"use client";

import { useState } from "react";
import { useWizard } from "../wizard-context";

export function PreviewFaq({ deviceMode: _deviceMode }: { deviceMode: "desktop" | "mobile" }) {
  const { state } = useWizard();
  const { content, fontFamily, faqVariant } = state;
  const items = (content.faqItems as Array<{ question: string; answer: string }> ?? [])
    .filter(i => i.question?.trim());
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (items.length === 0) return null;

  const variant = faqVariant || "accordion";
  const baseStyle = { fontFamily: fontFamily || "Inter" };

  if (variant === "numbered") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.faqTitle ?? "Perguntas frequentes")}
        </h2>
        <div className="space-y-3">
          {items.slice(0, 4).map((item, i) => (
            <div key={i} className="flex gap-2.5">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-black text-white"
                style={{ backgroundColor: "var(--preview-primary)" }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full text-left"
                >
                  <p className="text-[8px] font-semibold leading-snug" style={{ color: "var(--preview-text)" }}>
                    {item.question}
                  </p>
                </button>
                {openIdx === i && (
                  <p className="mt-1 text-[7px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
                    {item.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "two-col") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.faqTitle ?? "Perguntas frequentes")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {items.slice(0, 6).map((item, i) => (
            <div
              key={i}
              className="rounded-lg p-2"
              style={{
                border: "1px solid color-mix(in srgb, var(--preview-text) 12%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--preview-text) 3%, transparent)",
              }}
            >
              <p className="text-[7px] font-semibold leading-snug" style={{ color: "var(--preview-primary)" }}>
                {item.question}
              </p>
              <p className="mt-1 text-[6px] leading-relaxed line-clamp-2" style={{ color: "var(--preview-muted)" }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Accordion (default)
  return (
    <section className="px-3 py-4" style={baseStyle}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {String(content.faqTitle ?? "Perguntas frequentes")}
      </h2>
      <div className="space-y-1.5">
        {items.slice(0, 5).map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg"
            style={{
              border: `1px solid ${openIdx === i ? "color-mix(in srgb, var(--preview-primary) 40%, transparent)" : "color-mix(in srgb, var(--preview-text) 12%, transparent)"}`,
              backgroundColor: openIdx === i ? "color-mix(in srgb, var(--preview-primary) 6%, transparent)" : "color-mix(in srgb, var(--preview-text) 3%, transparent)",
            }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left"
            >
              <p className="text-[8px] font-semibold leading-snug" style={{ color: openIdx === i ? "var(--preview-primary)" : "var(--preview-text)" }}>
                {item.question}
              </p>
              <span className="text-[10px]" style={{ color: "var(--preview-primary)", transform: openIdx === i ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
            </button>
            {openIdx === i && (
              <p className="px-2.5 pb-2 text-[7px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
