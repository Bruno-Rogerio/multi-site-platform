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
      : "6px";

  const title = content.heroTitle || "Seu título principal aqui";
  const subtitle = content.heroSubtitle || "";
  const eyebrow = content.heroEyebrow || "";
  const ctaLabel = content.heroCtaLabel || "Saiba mais";

  // ── split: grid text + image (matches published) ──
  if (heroVariant === "split") {
    return (
      <section className="px-3 py-5" style={{ fontFamily: fontFamily || "Inter" }}>
        <div className={`flex gap-3 ${deviceMode === "mobile" ? "flex-col" : "items-center"}`}>
          <div className="flex-1">
            {eyebrow && (
              <p className="mb-1 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
                {eyebrow}
              </p>
            )}
            <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`} style={{ color: "var(--preview-text)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
                {subtitle}
              </p>
            )}
            <span
              className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
              style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
            >
              {ctaLabel}
            </span>
          </div>
          {heroImage ? (
            <div
              className={`overflow-hidden ${deviceMode === "mobile" ? "h-20 w-full" : "w-[40%] shrink-0"}`}
              style={{ borderRadius: "var(--preview-radius)", border: "1px solid var(--preview-text)18" }}
            >
              <img src={heroImage} alt="Hero" className="h-full w-full object-cover aspect-[4/3]" />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${deviceMode === "mobile" ? "h-20 w-full" : "w-[40%] shrink-0 aspect-[4/3]"}`}
              style={{ borderRadius: "var(--preview-radius)", border: "1px dashed var(--preview-primary)40", backgroundColor: "var(--preview-primary)08" }}
            >
              <span className="text-[6px]" style={{ color: "var(--preview-primary)" }}>Imagem</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── centered (matches published) ──
  if (heroVariant === "centered") {
    return (
      <section className="px-3 py-6 text-center" style={{ fontFamily: fontFamily || "Inter" }}>
        {heroImage && (
          <div
            className="mx-auto mb-3 h-16 w-full max-w-[80%] overflow-hidden"
            style={{ borderRadius: "var(--preview-radius)", border: "1px solid var(--preview-text)18" }}
          >
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}
        {eyebrow && (
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
            {eyebrow}
          </p>
        )}
        <h1 className={`font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`} style={{ color: "var(--preview-text)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[8px] mx-auto max-w-[80%] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
            {subtitle}
          </p>
        )}
        <span
          className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
          style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
        >
          {ctaLabel}
        </span>
      </section>
    );
  }

  // ── minimal: border-left accent, underline CTA (matches published) ──
  if (heroVariant === "minimal") {
    return (
      <section className="px-3 py-5" style={{ fontFamily: fontFamily || "Inter" }}>
        {heroImage && (
          <div
            className="mb-3 h-12 w-full overflow-hidden"
            style={{ borderRadius: "var(--preview-radius)", border: "1px solid var(--preview-text)18" }}
          >
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}
        {eyebrow && (
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-bold leading-tight border-l-[3px] pl-2 ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`}
          style={{ color: "var(--preview-text)", borderColor: "var(--preview-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
            {subtitle}
          </p>
        )}
        <span
          className="mt-2 inline-block text-[8px] font-semibold underline underline-offset-2 cursor-default"
          style={{ color: "var(--preview-primary)" }}
        >
          {ctaLabel} &rarr;
        </span>
      </section>
    );
  }

  // ── card: floating card on gradient bg (matches published) ──
  if (heroVariant === "card") {
    return (
      <section
        className="px-3 py-5"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse at top, var(--preview-primary)10, var(--preview-bg))",
        }}
      >
        <div
          className="overflow-hidden p-3 text-center"
          style={{
            borderRadius: "var(--preview-radius)",
            border: "1px solid var(--preview-primary)30",
            boxShadow: "0 4px 20px var(--preview-primary)15",
            backgroundColor: "var(--preview-text)06",
          }}
        >
          {heroImage && (
            <div className="-mx-3 -mt-3 mb-3 h-16 overflow-hidden">
              <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
            </div>
          )}
          {eyebrow && (
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
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
          <span
            className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
            style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
          >
            {ctaLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── centered-gradient: full gradient bg, white text (matches published) ──
  if (heroVariant === "centered-gradient") {
    return (
      <section
        className="px-3 py-6 text-center"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
        }}
      >
        {heroImage && (
          <div className="mx-auto mb-3 h-16 w-full max-w-[80%] overflow-hidden rounded-lg border border-white/20">
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}
        {eyebrow && (
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-wider text-white/80">
            {eyebrow}
          </p>
        )}
        <h1 className={`font-bold leading-tight text-white ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[8px] mx-auto max-w-[80%] leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}
        <span
          className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
          style={{ backgroundColor: "white", color: "var(--preview-primary)", borderRadius: buttonRadius }}
        >
          {ctaLabel}
        </span>
      </section>
    );
  }

  // ── default: gradient blob + eyebrow separator (matches published) ──
  return (
    <section className="relative overflow-hidden px-3 py-5" style={{ fontFamily: fontFamily || "Inter" }}>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-[0.07] blur-xl"
        style={{ background: "radial-gradient(circle, var(--preview-primary), transparent)" }}
      />
      {heroImage && (
        <div
          className="mb-3 h-14 w-full overflow-hidden"
          style={{ borderRadius: "var(--preview-radius)", border: "1px solid var(--preview-text)18" }}
        >
          <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
        </div>
      )}
      {eyebrow && (
        <>
          <p className="mb-0.5 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
            {eyebrow}
          </p>
          <div className="mb-2 h-[1px] w-6" style={{ backgroundColor: "var(--preview-accent)" }} />
        </>
      )}
      <h1 className={`relative font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`} style={{ color: "var(--preview-text)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
          {subtitle}
        </p>
      )}
      <span
        className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
        style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
      >
        {ctaLabel}
      </span>
    </section>
  );
}
