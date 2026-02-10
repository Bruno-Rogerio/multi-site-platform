"use client";

import { useWizard } from "../wizard-context";

interface PreviewHeroProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewHero({ deviceMode }: PreviewHeroProps) {
  const { state } = useWizard();
  const { content, fontFamily, buttonStyle, heroVariant, heroImage } = state;

  const buttonRadius =
    buttonStyle === "pill"
      ? "9999px"
      : buttonStyle === "square"
      ? "0px"
      : buttonStyle === "soft"
      ? "12px"
      : "6px";

  const title = content.heroTitle || "Seu título principal aqui";
  const subtitle = content.heroSubtitle || "";
  const eyebrow = content.heroEyebrow || "";
  const ctaLabel = content.heroCtaLabel || "Saiba mais";
  const ctaUrl = content.heroCtaUrl || "";

  function CtaButton({ variant }: { variant?: "underline" }) {
    if (variant === "underline") {
      return (
        <span
          className="mt-2 inline-block text-[8px] font-semibold underline cursor-default"
          style={{ color: "var(--preview-primary)" }}
          title={ctaUrl || undefined}
        >
          {ctaLabel} &rarr;
        </span>
      );
    }
    return (
      <span
        className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold text-white cursor-default"
        style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius }}
        title={ctaUrl || undefined}
      >
        {ctaLabel}
      </span>
    );
  }

  function HeroImage() {
    if (heroImage) {
      return (
        <div
          className={`overflow-hidden ${deviceMode === "mobile" ? "h-16 w-full" : "h-20 w-20"}`}
          style={{ borderRadius: "var(--preview-radius)" }}
        >
          <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
        </div>
      );
    }
    return (
      <div
        className={`${deviceMode === "mobile" ? "h-16 w-full" : "h-20 w-20"}`}
        style={{ borderRadius: "var(--preview-radius)", backgroundColor: `var(--preview-primary)20`, border: `1px dashed var(--preview-primary)40` }}
      >
        <div className="flex h-full items-center justify-center">
          <span className="text-[6px]" style={{ color: "var(--preview-primary)" }}>Imagem</span>
        </div>
      </div>
    );
  }

  // Variant: Centered / Centered-gradient
  if (heroVariant === "centered" || heroVariant === "centered-gradient") {
    const hasGradient = heroVariant === "centered-gradient";
    return (
      <section
        className={`px-3 text-center ${hasGradient ? "py-8" : "py-6"}`}
        style={{
          fontFamily: fontFamily || "Inter",
          background: hasGradient
            ? `linear-gradient(135deg, var(--preview-primary), var(--preview-accent))`
            : undefined,
        }}
      >
        {heroImage && (
          <div className="mx-auto mb-3 h-20 w-full max-w-[70%] overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}
        {eyebrow && (
          <p className="text-[7px] font-semibold uppercase tracking-wider mb-1" style={{ color: hasGradient ? "rgba(255,255,255,0.8)" : "var(--preview-accent)" }}>
            {eyebrow}
          </p>
        )}
        <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-base"}`} style={{ color: hasGradient ? "white" : "var(--preview-text)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[8px] mx-auto max-w-[80%] leading-relaxed" style={{ color: hasGradient ? "rgba(255,255,255,0.7)" : "var(--preview-muted)" }}>
            {subtitle}
          </p>
        )}
        {hasGradient ? (
          <span
            className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
            style={{ backgroundColor: "white", color: "var(--preview-primary)", borderRadius: buttonRadius }}
            title={ctaUrl || undefined}
          >
            {ctaLabel}
          </span>
        ) : (
          <CtaButton />
        )}
      </section>
    );
  }

  // Variant: Minimal
  if (heroVariant === "minimal") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        {heroImage && (
          <div className="mb-3 h-16 w-full overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`} style={{ color: "var(--preview-text)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
            {subtitle}
          </p>
        )}
        <CtaButton variant="underline" />
      </section>
    );
  }

  // Variant: Split (text left, image right)
  if (heroVariant === "split") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div className={`flex gap-3 ${deviceMode === "mobile" ? "flex-col" : "items-center"}`}>
          <div className="flex-1">
            {eyebrow && (
              <p className="text-[7px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--preview-accent)" }}>
                {eyebrow}
              </p>
            )}
            <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-base"}`} style={{ color: "var(--preview-text)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
                {subtitle}
              </p>
            )}
            <CtaButton />
          </div>
          <HeroImage />
        </div>
      </section>
    );
  }

  // Variant: Card
  if (heroVariant === "card") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="p-4 text-center border-2 overflow-hidden"
          style={{
            borderRadius: "var(--preview-radius)",
            backgroundColor: `var(--preview-primary)12`,
            borderColor: `var(--preview-primary)40`,
            boxShadow: `0 4px 20px var(--preview-primary)15`,
          }}
        >
          {heroImage && (
            <div className="-mx-4 -mt-4 mb-3 h-20 overflow-hidden">
              <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
            </div>
          )}
          {eyebrow && (
            <p className="text-[7px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--preview-accent)" }}>
              {eyebrow}
            </p>
          )}
          <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-base"}`} style={{ color: "var(--preview-text)" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[8px] mx-auto max-w-[90%] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
              {subtitle}
            </p>
          )}
          <CtaButton />
        </div>
      </section>
    );
  }

  // Default fallback (centered)
  return (
    <section className="px-3 py-6 text-center" style={{ fontFamily: fontFamily || "Inter" }}>
      <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-base"}`} style={{ color: "var(--preview-text)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[8px] mx-auto max-w-[80%] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
          {subtitle}
        </p>
      )}
      <CtaButton />
    </section>
  );
}
