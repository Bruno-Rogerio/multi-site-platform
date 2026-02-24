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
      className="px-3 py-4"
      style={{ fontFamily: fontFamily || "Inter" }}
    >
      {aboutImage ? (
        <div
          className={`flex gap-2 ${deviceMode === "mobile" ? "flex-col" : ""}`}
        >
          <div
            className="shrink-0 overflow-hidden"
            style={{
              borderRadius: "var(--preview-radius)",
              width: deviceMode === "mobile" ? "100%" : "40%",
              border: `1px solid var(--preview-text)18`,
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
            <h2
              className="text-[10px] font-bold"
              style={{ color: "var(--preview-text)" }}
            >
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
        <>
          <h2
            className="text-[10px] font-bold"
            style={{ color: "var(--preview-text)" }}
          >
            {title}
          </h2>
          <p
            className="mt-1 text-[7px] leading-relaxed line-clamp-4"
            style={{ color: "var(--preview-muted)" }}
          >
            {body}
          </p>
        </>
      )}
    </section>
  );
}
