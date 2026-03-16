"use client";

import React from "react";

export type AccentEffect = "gradient" | "neon" | "underline" | "highlight" | "bold-accent";

export function getAccentStyle(effect: string): React.CSSProperties {
  switch (effect as AccentEffect) {
    case "gradient":
      return {
        background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    case "neon":
      return {
        color: "var(--preview-accent)",
        textShadow: "0 0 6px var(--preview-accent), 0 0 16px var(--preview-accent)",
      };
    case "underline":
      return {
        borderBottom: "2px solid var(--preview-accent)",
        paddingBottom: "1px",
        color: "inherit",
      };
    case "highlight":
      return {
        backgroundColor: "color-mix(in srgb, var(--preview-primary) 24%, transparent)",
        borderRadius: "3px",
        padding: "1px 3px",
        color: "inherit",
      };
    case "bold-accent":
      return {
        fontWeight: "bold",
        color: "var(--preview-primary)",
      };
    default:
      return {};
  }
}

export function renderAccentedText(
  text: string,
  accentWord: string,
  effect: string,
): React.ReactNode {
  if (!accentWord?.trim() || !text) return text;
  const idx = text.indexOf(accentWord);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={getAccentStyle(effect)}>{accentWord}</span>
      {text.slice(idx + accentWord.length)}
    </>
  );
}
