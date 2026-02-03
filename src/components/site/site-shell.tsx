import type { CSSProperties, ReactNode } from "react";

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

export function SiteShell({ site, children }: SiteShellProps) {
  const style = {
    "--site-primary": site.themeSettings.primaryColor,
    "--site-accent": site.themeSettings.accentColor,
    "--site-background": site.themeSettings.backgroundColor,
    "--site-text": site.themeSettings.textColor,
    fontFamily: site.themeSettings.fontFamily,
  } as CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-[var(--site-background)] text-[var(--site-text)]">
      <header className="sticky top-0 z-20 border-b border-black/8 bg-[var(--site-background)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-lg font-bold">{site.name}</p>
            <p className="text-xs opacity-70">{site.plan === "pro" ? "Plano Pro" : "Plano Landing"}</p>
          </div>
          <a
            href="#cta"
            className={`bg-[var(--site-primary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 ${buttonStyleClasses[site.themeSettings.buttonStyle]}`}
          >
            Agendar
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-8">{children}</main>

      <footer className="border-t border-black/8 py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 text-xs opacity-70">
          <span>{site.name}</span>
          <span>Powered by Multi Site Platform</span>
        </div>
      </footer>
    </div>
  );
}
