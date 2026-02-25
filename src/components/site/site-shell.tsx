import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

import type { Site } from "@/lib/tenant/types";

type SiteShellProps = {
  site: Site;
  children: ReactNode;
};

export const buttonStyleClasses: Record<Site["themeSettings"]["buttonStyle"], string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  square: "rounded-none",
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return { r: 11, g: 16, b: 32 };
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function contrastRatio(foregroundHex: string, backgroundHex: string) {
  const l1 = luminance(foregroundHex);
  const l2 = luminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveReadableText(textHex: string, backgroundHex: string) {
  if (contrastRatio(textHex, backgroundHex) >= 4.5) {
    return textHex;
  }

  const dark = "#0B1020";
  const light = "#EAF0FF";
  return contrastRatio(dark, backgroundHex) >= contrastRatio(light, backgroundHex)
    ? dark
    : light;
}

export function SiteShell({ site, children }: SiteShellProps) {
  const logoUrl = site.themeSettings.logoUrl?.trim() ?? "";
  const readableText = resolveReadableText(
    site.themeSettings.textColor,
    site.themeSettings.backgroundColor,
  );
  const isDarkText = luminance(readableText) < 0.4;

  const style = {
    "--site-primary": site.themeSettings.primaryColor,
    "--site-accent": site.themeSettings.accentColor,
    "--site-background": site.themeSettings.backgroundColor,
    "--site-text": readableText,
    "--site-surface": isDarkText ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.06)",
    "--site-border": isDarkText ? "rgba(11,16,32,0.14)" : "rgba(234,240,255,0.16)",
    "--site-radius": site.themeSettings["--site-radius"] ?? "24px",
    "--site-spacing": site.themeSettings["--site-spacing"] ?? "16px",
    "--site-shadow": site.themeSettings["--site-shadow"] ?? "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: site.themeSettings.fontFamily,
  } as CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-[var(--site-background)] text-[var(--site-text)]">
      <header className="sticky top-0 z-20 border-b border-[var(--site-border)] bg-[var(--site-background)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Logo de ${site.name}`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg border border-[var(--site-border)] object-cover"
              />
            ) : null}
            <p className="text-lg font-bold">{site.name}</p>
          </div>
          <nav className="hidden items-center gap-5 md:flex">
            <a href="#services" className="text-sm opacity-70 transition hover:opacity-100">Serviços</a>
            <a href="#about" className="text-sm opacity-70 transition hover:opacity-100">Sobre</a>
            <a href="#contact" className="text-sm opacity-70 transition hover:opacity-100">Contato</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-8">{children}</main>

      <footer className="border-t border-[var(--site-border)] py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 text-xs opacity-70">
          <span className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Logo de ${site.name}`}
                width={24}
                height={24}
                className="h-6 w-6 rounded-md border border-[var(--site-border)] object-cover"
              />
            ) : null}
            <span>{site.name}</span>
          </span>
          <span>Powered by Multi Site Platform</span>
        </div>
      </footer>
    </div>
  );
}
