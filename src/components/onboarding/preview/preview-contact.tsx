"use client";

import { useWizard } from "../wizard-context";
import { ctaTypes } from "@/lib/onboarding/cta-types";
import * as LucideIcons from "lucide-react";

interface PreviewContactProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewContact({ deviceMode }: PreviewContactProps) {
  const { state } = useWizard();
  const { content, fontFamily, selectedCtaTypes, businessName } = state;

  const activeCtaTypes = ctaTypes.filter((cta) => selectedCtaTypes.includes(cta.id));

  return (
    <footer
      className="px-3 py-4 border-t"
      style={{
        fontFamily: fontFamily || "Inter",
        borderColor: `var(--preview-text)10`,
        backgroundColor: `var(--preview-text)03`,
      }}
    >
      {/* Contact title */}
      <div className="mb-2">
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

      {/* CTA icons */}
      {activeCtaTypes.length > 0 && (
        <div className="flex gap-2 mb-3">
          {activeCtaTypes.map((cta) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[cta.icon];
            return (
              <div
                key={cta.id}
                className="flex h-5 w-5 items-center justify-center rounded"
                style={{ backgroundColor: `var(--preview-primary)15` }}
              >
                {Icon && (
                  <Icon
                    size={10}
                    style={{ color: "var(--preview-primary)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer text */}
      <div
        className="pt-2 border-t text-[6px]"
        style={{
          borderColor: `var(--preview-text)10`,
          color: "var(--preview-muted)",
        }}
      >
        {content.footerText || `© 2025 ${businessName || "Seu Negocio"}`}
      </div>
    </footer>
  );
}
