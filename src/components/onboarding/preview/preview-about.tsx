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

  return (
    <section
      className="px-3 py-4"
      style={{ fontFamily: fontFamily || "Inter" }}
    >
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
    </section>
  );
}
