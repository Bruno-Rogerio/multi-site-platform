"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Globe,
  Palette,
  Smartphone,
  Zap,
  Shield,
  PenTool,
} from "lucide-react";

const iconMap = {
  Globe,
  Palette,
  Smartphone,
  Zap,
  Shield,
  PenTool,
} as const;

export type IconName = keyof typeof iconMap;

type FeatureCardProps = {
  iconName: IconName;
  title: string;
  description: string;
};

export function FeatureCard({ iconName, title, description }: FeatureCardProps) {
  const Icon = iconMap[iconName];
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12182B]/60 p-6 transition-colors duration-300 hover:border-[#22D3EE]/25"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(124,92,255,0.12))]">
          <Icon size={22} className="text-[#22D3EE]" />
        </div>
        <h3 className="mt-4 text-base font-bold text-[var(--platform-text)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--platform-text)]/60">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
