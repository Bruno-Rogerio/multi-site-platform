"use client";

import * as LucideIcons from "lucide-react";

const EDITOR_ICONS = [
  "Star", "Heart", "Shield", "Zap", "Camera", "Scissors", "Palette",
  "Music", "BookOpen", "Coffee", "Home", "Briefcase", "Users", "Target",
  "Award", "Lightbulb", "Clock", "MapPin", "Phone", "Globe",
] as const;

function getIcon(name: string) {
  const key = name as keyof typeof LucideIcons;
  const comp = LucideIcons[key];
  // lucide-react exports icons as forwardRef objects (typeof === "object"), not plain functions
  if (comp && key !== "createLucideIcon") {
    return comp as React.ComponentType<{ size?: number; className?: string }>;
  }
  return null;
}

interface IconPickerInlineProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export function IconPickerInline({ selectedIcon, onSelect }: IconPickerInlineProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {EDITOR_ICONS.map((name) => {
        const Icon = getIcon(name);
        if (!Icon) return null;
        const isSelected = selectedIcon === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            title={name}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
              isSelected
                ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                : "text-[var(--platform-text)]/40 hover:bg-white/[0.06] hover:text-[var(--platform-text)]/70"
            }`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
