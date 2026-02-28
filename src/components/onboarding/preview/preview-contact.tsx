"use client";

import { useWizard } from "../wizard-context";
import { ctaTypes } from "@/lib/onboarding/cta-types";
import * as LucideIcons from "lucide-react";

interface PreviewContactProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewContact({ deviceMode }: PreviewContactProps) {
  const { state } = useWizard();
  const { content, fontFamily, selectedCtaTypes, contactSelectedLinks, businessName } = state;

  const activeCtaTypes = ctaTypes.filter((cta) => {
    if (contactSelectedLinks.length > 0) {
      return contactSelectedLinks.includes(cta.id);
    }
    return selectedCtaTypes.includes(cta.id);
  });

  return (
    <footer
      className="relative px-3 py-4 border-t overflow-hidden"
      style={{
        fontFamily: fontFamily || "Inter",
        borderColor: `color-mix(in srgb, var(--preview-primary) 20%, transparent)`,
        background: "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--preview-primary) 10%, transparent), transparent)",
      }}
    >
      {/* Orbs */}
      <div
        className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 rounded-full opacity-[0.12] blur-xl"
        style={{ background: "var(--preview-primary)" }}
      />
      <div
        className="pointer-events-none absolute -right-2 -bottom-2 h-8 w-8 rounded-full opacity-[0.10] blur-lg"
        style={{ background: "var(--preview-accent)" }}
      />

      {/* Contact title */}
      <div className="relative mb-3">
        {/* Gradient accent bar */}
        <div
          className="mb-1.5 h-[2px] w-6 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--preview-primary), var(--preview-accent))" }}
        />
        <h3
          className="text-[9px] font-bold"
          style={{ color: "var(--preview-text)" }}
        >
          {content.contactTitle || "Contato"}
        </h3>
        {content.contactSubtitle && (
          <p
            className="text-[6px] mt-0.5"
            style={{ color: "var(--preview-muted)" }}
          >
            {content.contactSubtitle}
          </p>
        )}
      </div>

      {/* CTA icons — bigger, with labels */}
      {activeCtaTypes.length > 0 && (
        <div className="relative flex flex-wrap gap-2 mb-3">
          {activeCtaTypes.map((cta) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[cta.icon];
            return (
              <div
                key={cta.id}
                className="flex flex-col items-center gap-0.5"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--preview-primary) 22%, transparent), color-mix(in srgb, var(--preview-accent) 18%, transparent))",
                    border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                    boxShadow: "0 2px 6px color-mix(in srgb, var(--preview-primary) 14%, transparent)",
                  }}
                >
                  {Icon && (
                    <Icon
                      size={13}
                      style={{ color: "var(--preview-primary)" }}
                    />
                  )}
                </div>
                <span className="text-[5px] font-medium" style={{ color: "var(--preview-muted)" }}>
                  {cta.label || cta.id}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer text */}
      <div
        className="relative pt-2 border-t text-[6px]"
        style={{
          borderColor: `color-mix(in srgb, var(--preview-primary) 15%, transparent)`,
          color: "var(--preview-muted)",
        }}
      >
        {content.footerText || `© 2026 ${businessName || "Seu Negócio"}`}
      </div>
    </footer>
  );
}
