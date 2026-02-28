"use client";

import { useWizard } from "../wizard-context";

interface PreviewAboutProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewAbout({ deviceMode }: PreviewAboutProps) {
  const { state } = useWizard();
  const { content, fontFamily, businessName } = state;

  const title = content.aboutTitle || `Sobre ${businessName || "Seu Negócio"}`;
  const body =
    content.aboutBody ||
    `${businessName || "Seu Negócio"} — atendimento personalizado com foco em resultado e acolhimento.`;
  const aboutImage = content.aboutImage || "";

  return (
    <section
      className="relative px-3 py-4 overflow-hidden"
      style={{
        fontFamily: fontFamily || "Inter",
        background: "radial-gradient(ellipse 55% 70% at 100% 50%, color-mix(in srgb, var(--preview-accent) 7%, transparent), transparent)",
      }}
    >
      {/* Subtle orb */}
      <div
        className="pointer-events-none absolute -right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full opacity-[0.12] blur-xl"
        style={{ background: "var(--preview-primary)" }}
      />

      {aboutImage ? (
        <div className={`relative flex gap-2 ${deviceMode === "mobile" ? "flex-col" : ""}`}>
          <div
            className="shrink-0 overflow-hidden"
            style={{
              borderRadius: "var(--preview-radius)",
              width: deviceMode === "mobile" ? "100%" : "40%",
              border: "1px solid color-mix(in srgb, var(--preview-primary) 22%, transparent)",
              boxShadow: "0 4px 14px color-mix(in srgb, var(--preview-primary) 14%, transparent)",
            }}
          >
            <img
              src={aboutImage}
              alt={title}
              className="w-full object-cover"
              style={{
                aspectRatio: "3/4",
                minHeight: deviceMode === "mobile" ? "60px" : "80px",
                maxHeight: deviceMode === "mobile" ? "60px" : "80px",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Gradient accent bar */}
            <div
              className="mb-1.5 h-[2px] w-7 rounded-full"
              style={{ background: "linear-gradient(90deg, var(--preview-primary), var(--preview-accent))" }}
            />
            <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
              {title}
            </h2>
            <p
              className="mt-1 text-[7px] leading-relaxed line-clamp-4"
              style={{ color: "var(--preview-muted)" }}
            >
              {body}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative p-3"
          style={{
            border: "1px solid color-mix(in srgb, var(--preview-primary) 18%, transparent)",
            borderRadius: "var(--preview-radius)",
            background: "color-mix(in srgb, var(--preview-primary) 6%, transparent)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Gradient accent bar */}
          <div
            className="mb-2 h-[2px] w-7 rounded-full"
            style={{ background: "linear-gradient(90deg, var(--preview-primary), var(--preview-accent))" }}
          />
          <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
            {title}
          </h2>
          <p
            className="mt-1 text-[7px] leading-relaxed line-clamp-4"
            style={{ color: "var(--preview-muted)" }}
          >
            {body}
          </p>
        </div>
      )}
    </section>
  );
}
