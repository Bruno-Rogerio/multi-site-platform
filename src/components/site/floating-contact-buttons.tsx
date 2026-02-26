"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

type FloatingLink = { type: string; url: string; icon: string; label: string };

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
      {links.map((link, i) => {
        const Icon = (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<{ size?: number; className?: string }>
          >
        )[link.icon];

        return (
          <motion.a
            key={link.type}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            initial={{ opacity: 0, x: 40, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: i * 0.12,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            whileHover={{ scale: 1.14, boxShadow: "0 8px 28px rgba(0,0,0,0.22)" }}
            whileTap={{ scale: 0.93 }}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: getIconBg(link.type) }}
          >
            {Icon ? (
              <Icon size={26} className="text-white" />
            ) : (
              <span className="text-sm font-bold text-white">{link.type[0].toUpperCase()}</span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}
