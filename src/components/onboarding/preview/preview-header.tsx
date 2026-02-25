"use client";

import { useWizard } from "../wizard-context";
import { Menu } from "lucide-react";

interface PreviewHeaderProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewHeader({ deviceMode }: PreviewHeaderProps) {
  const { state } = useWizard();
  const { businessName, fontFamily, content, logoUrl, headerStyle } = state;
  const slogan = content.slogan || "";

  const navLinks = (
    <>
      <span className="text-[8px]" style={{ color: "var(--preview-muted)" }}>Serviços</span>
      <span className="text-[8px]" style={{ color: "var(--preview-muted)" }}>Sobre</span>
      <span className="text-[8px]" style={{ color: "var(--preview-muted)" }}>Contato</span>
    </>
  );

  const logoBlock = (
    <div className="flex items-center gap-1.5 min-w-0">
      {logoUrl && (
        <img src={logoUrl} alt="Logo" className="h-5 w-5 rounded-sm object-cover shrink-0" />
      )}
      <div className="min-w-0">
        <div className="text-xs font-bold truncate leading-tight" style={{ color: "var(--preview-primary)" }}>
          {businessName || "Seu Negócio"}
        </div>
        {slogan && (
          <div className="text-[6px] truncate leading-tight" style={{ color: "var(--preview-muted)" }}>
            {slogan}
          </div>
        )}
      </div>
    </div>
  );

  // ── solid: bg opaco na cor primária, texto branco ──
  if (headerStyle === "solid") {
    return (
      <header
        className="sticky top-0 z-10 px-3 py-2"
        style={{ backgroundColor: "var(--preview-primary)", fontFamily: fontFamily || "Inter" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-5 w-5 rounded-sm object-cover shrink-0" />
            )}
            <div className="text-xs font-bold truncate leading-tight text-white">
              {businessName || "Seu Negócio"}
            </div>
          </div>
          {deviceMode === "desktop" ? (
            <nav className="flex items-center gap-3">
              <span className="text-[8px] text-white/70">Serviços</span>
              <span className="text-[8px] text-white/70">Sobre</span>
              <span className="text-[8px] text-white/70">Contato</span>
            </nav>
          ) : (
            <Menu size={14} className="text-white" />
          )}
        </div>
      </header>
    );
  }

  // ── minimal: logo/nome centralizado, nav abaixo ──
  if (headerStyle === "minimal") {
    return (
      <header
        className="sticky top-0 z-10 px-3 py-2 border-b"
        style={{
          backgroundColor: "var(--preview-bg)",
          borderColor: "var(--preview-text)08",
          fontFamily: fontFamily || "Inter",
        }}
      >
        {deviceMode === "desktop" ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-4 w-4 rounded-sm object-cover" />
              )}
              <div className="text-xs font-bold" style={{ color: "var(--preview-primary)" }}>
                {businessName || "Seu Negócio"}
              </div>
            </div>
            {slogan && (
              <div className="text-[6px]" style={{ color: "var(--preview-muted)" }}>{slogan}</div>
            )}
            <nav className="flex items-center gap-3 mt-1 pt-1 border-t w-full justify-center"
              style={{ borderColor: "var(--preview-text)08" }}>
              {navLinks}
            </nav>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {logoBlock}
            <Menu size={14} style={{ color: "var(--preview-text)" }} />
          </div>
        )}
      </header>
    );
  }

  // ── blur (padrão): sticky + backdrop-blur ──
  return (
    <header
      className="sticky top-0 z-10 px-3 py-2 border-b backdrop-blur-sm"
      style={{
        backgroundColor: "var(--preview-bg)e0",
        borderColor: "var(--preview-text)10",
        fontFamily: fontFamily || "Inter",
      }}
    >
      <div className="flex items-center justify-between">
        {logoBlock}
        {deviceMode === "desktop" ? (
          <nav className="flex items-center gap-3">{navLinks}</nav>
        ) : (
          <Menu size={14} style={{ color: "var(--preview-text)" }} />
        )}
      </div>
    </header>
  );
}
