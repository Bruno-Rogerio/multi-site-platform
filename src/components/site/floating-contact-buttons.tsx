"use client";

import * as LucideIcons from "lucide-react";

type FloatingLink = { type: string; url: string; icon: string; label: string };

// WhatsApp green — all others use site-primary color
const WHATSAPP_COLOR = "#25D366";

function getIconBg(type: string): string {
  if (type === "whatsapp") return WHATSAPP_COLOR;
  return "var(--site-primary)";
}

interface FloatingContactButtonsProps {
  links: FloatingLink[];
}

export function FloatingContactButtons({ links }: FloatingContactButtonsProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {links.map((link) => {
        const Icon = (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<{ size?: number; className?: string }>
          >
        )[link.icon];

        return (
          <a
            key={link.type}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: getIconBg(link.type) }}
          >
            {Icon ? (
              <Icon size={26} className="text-white" />
            ) : (
              <span className="text-xs font-bold text-white">{link.type[0].toUpperCase()}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
