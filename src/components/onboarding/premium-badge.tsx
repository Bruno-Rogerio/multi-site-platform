"use client";

import { Lock } from "lucide-react";
import { formatPrice } from "@/lib/onboarding/pricing";

type PremiumBadgeProps = {
  price?: number;
  size?: "sm" | "md";
  showPrice?: boolean;
  onClick?: () => void;
};

export function PremiumBadge({
  price,
  size = "sm",
  showPrice = true,
  onClick,
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full bg-[#7C5CFF]/20 font-semibold text-[#A78BFA] ${sizeClasses[size]} ${onClick ? "cursor-pointer hover:bg-[#7C5CFF]/30 transition-colors" : ""}`}
    >
      <Lock size={iconSize} />
      Premium
      {showPrice && price && (
        <span className="text-[#22D3EE]">+{formatPrice(price)}</span>
      )}
    </span>
  );
}

type IncludedBadgeProps = {
  size?: "sm" | "md";
};

export function IncludedBadge({ size = "sm" }: IncludedBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#22D3EE]/20 font-semibold text-[#22D3EE] ${sizeClasses[size]}`}
    >
      Incluso
    </span>
  );
}

type BlockedBadgeProps = {
  size?: "sm" | "md";
};

export function BlockedBadge({ size = "sm" }: BlockedBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center rounded-full bg-white/10 font-semibold text-[var(--platform-text)]/40 ${sizeClasses[size]}`}
    >
      <Lock size={iconSize} />
      Indisponivel
    </span>
  );
}
