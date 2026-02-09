"use client";

import { useWizard } from "../wizard-context";
import { ctaTypes } from "@/lib/onboarding/cta-types";
import { buildCtaUrl } from "@/lib/onboarding/cta-types";
import * as LucideIcons from "lucide-react";

export function PreviewFloatingCta() {
  const { state } = useWizard();
  const { floatingCtaChannels, selectedCtaTypes, ctaConfig } = state;

  // Use floatingCtaChannels if set, otherwise fall back to first selectedCtaType
  const channels = floatingCtaChannels.length > 0
    ? floatingCtaChannels
    : selectedCtaTypes.length > 0
    ? [selectedCtaTypes[0]]
    : [];

  if (channels.length === 0) return null;

  return (
    <div className="sticky bottom-2 ml-auto mr-2 w-fit z-20 flex flex-col gap-2 items-end">
      {channels.map((ctaId) => {
        const ctaDef = ctaTypes.find((cta) => cta.id === ctaId);
        if (!ctaDef) return null;

        const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[ctaDef.icon];
        const config = ctaConfig[ctaId];
        const redirectUrl = config?.url ? buildCtaUrl(ctaId, config.url) : "";

        return (
          <div
            key={ctaId}
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-lg animate-pulse cursor-default"
            style={{
              backgroundColor: "var(--preview-primary)",
            }}
            title={redirectUrl || `${ctaDef.label} (configure o link)`}
          >
            {Icon && <Icon size={14} className="text-white" />}
          </div>
        );
      })}
    </div>
  );
}
