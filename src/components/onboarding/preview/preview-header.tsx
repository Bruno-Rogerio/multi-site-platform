"use client";

import { useWizard } from "../wizard-context";
import { Menu } from "lucide-react";

interface PreviewHeaderProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewHeader({ deviceMode }: PreviewHeaderProps) {
  const { state } = useWizard();
  const { businessName, fontFamily, content, logoUrl } = state;
  const slogan = content.slogan || "";

  return (
    <header
      className="sticky top-0 z-10 px-3 py-2 border-b"
      style={{
        backgroundColor: "var(--preview-bg)",
        borderColor: `${state.paletteId ? "var(--preview-text)" : "#fff"}10`,
        fontFamily: fontFamily || "Inter",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo/Name */}
        <div className="flex items-center gap-1.5 min-w-0">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-5 w-5 rounded-sm object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            <div
              className="text-xs font-bold truncate leading-tight"
              style={{ color: "var(--preview-primary)" }}
            >
              {businessName || "Seu Negocio"}
            </div>
            {slogan && (
              <div
                className="text-[6px] truncate leading-tight"
                style={{ color: "var(--preview-muted)" }}
              >
                {slogan}
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        {deviceMode === "desktop" ? (
          <nav className="flex items-center gap-3">
            <span
              className="text-[8px]"
              style={{ color: "var(--preview-muted)" }}
            >
              Servicos
            </span>
            <span
              className="text-[8px]"
              style={{ color: "var(--preview-muted)" }}
            >
              Sobre
            </span>
            <span
              className="text-[8px]"
              style={{ color: "var(--preview-muted)" }}
            >
              Contato
            </span>
          </nav>
        ) : (
          <Menu
            size={14}
            style={{ color: "var(--preview-text)" }}
          />
        )}
      </div>
    </header>
  );
}
