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

  // ── split: grid text + image ──
  if (heroVariant === "split") {
    return (
      <section
        className="relative px-3 py-5 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 80% 60% at 0% 0%, color-mix(in srgb, var(--preview-primary) 14%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full opacity-[0.22] blur-lg"
          style={{ background: "var(--preview-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-3 left-2 h-8 w-8 rounded-full opacity-[0.16] blur-md"
          style={{ background: "var(--preview-accent)" }}
        />
        <div className={`relative flex gap-3 ${deviceMode === "mobile" ? "flex-col" : "items-center"}`}>
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
              style={{
                borderRadius: "var(--preview-radius)",
                border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                boxShadow: "0 4px 16px color-mix(in srgb, var(--preview-primary) 18%, transparent)",
              }}
            >
              <img src={heroImage} alt="Hero" className="h-full w-full object-cover aspect-[4/3]" />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${deviceMode === "mobile" ? "h-20 w-full" : "w-[40%] shrink-0 aspect-[4/3]"}`}
              style={{
                borderRadius: "var(--preview-radius)",
                border: "1px dashed color-mix(in srgb, var(--preview-primary) 40%, transparent)",
                background: "color-mix(in srgb, var(--preview-primary) 10%, transparent)",
              }}
            >
              <span className="text-[6px]" style={{ color: "var(--preview-primary)" }}>Imagem</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── centered ──
  if (heroVariant === "centered") {
    return (
      <section
        className="relative px-3 py-6 text-center overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 90% 55% at 50% -5%, color-mix(in srgb, var(--preview-primary) 16%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full opacity-[0.18] blur-lg"
          style={{ background: "var(--preview-accent)" }}
        />
        <div
          className="pointer-events-none absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-[0.14] blur-md"
          style={{ background: "var(--preview-primary)" }}
        />
        <div className="relative">
          {heroImage && (
            <div
              className="mx-auto mb-3 h-16 w-full max-w-[80%] overflow-hidden"
              style={{
                borderRadius: "var(--preview-radius)",
                border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                boxShadow: "0 4px 14px color-mix(in srgb, var(--preview-primary) 14%, transparent)",
              }}
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
        </div>
      </section>
    );
  }

  // ── minimal: border-left accent ──
  if (heroVariant === "minimal") {
    return (
      <section className="relative px-3 py-5 overflow-hidden" style={{ fontFamily: fontFamily || "Inter" }}>
        {/* Very subtle orb */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-16 w-16 -translate-y-1/3 translate-x-1/3 rounded-full opacity-[0.10] blur-xl"
          style={{ background: "var(--preview-primary)" }}
        />
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
          className={`relative font-bold leading-tight border-l-[3px] pl-2 ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`}
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

  // ── card: floating card on gradient bg ──
  if (heroVariant === "card") {
    return (
      <section
        className="relative px-3 py-5 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse at top, color-mix(in srgb, var(--preview-primary) 18%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -left-4 -top-4 h-14 w-14 rounded-full opacity-[0.20] blur-xl"
          style={{ background: "var(--preview-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-4 -right-2 h-10 w-10 rounded-full opacity-[0.16] blur-lg"
          style={{ background: "var(--preview-accent)" }}
        />
        <div
          className="relative overflow-hidden p-3 text-center"
          style={{
            borderRadius: "var(--preview-radius)",
            border: "1px solid color-mix(in srgb, var(--preview-primary) 30%, transparent)",
            boxShadow: "0 4px 20px color-mix(in srgb, var(--preview-primary) 18%, transparent), inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
            background: "color-mix(in srgb, var(--preview-bg) 70%, transparent)",
            backdropFilter: "blur(8px)",
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

  // ── centered-gradient: full gradient bg, white text ──
  if (heroVariant === "centered-gradient") {
    return (
      <section
        className="relative px-3 py-6 text-center overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
        }}
      >
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "8px 8px" }}
        />
        {/* White orbs */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-white opacity-[0.15] blur-xl" />
        <div className="pointer-events-none absolute -bottom-4 -left-2 h-10 w-10 rounded-full bg-white opacity-[0.10] blur-lg" />
        <div className="relative">
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
            className="mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default bg-white"
            style={{ color: "var(--preview-primary)", borderRadius: buttonRadius }}
          >
            {ctaLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── default: gradient blob + eyebrow separator ──
  return (
    <section
      className="relative overflow-hidden px-3 py-5"
      style={{
        fontFamily: fontFamily || "Inter",
        background: "radial-gradient(ellipse 70% 50% at 70% 0%, color-mix(in srgb, var(--preview-primary) 12%, transparent), transparent)",
      }}
    >
      {/* Orbs */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-[0.22] blur-xl"
        style={{ background: "var(--preview-primary)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-3 -left-2 h-10 w-10 rounded-full opacity-[0.14] blur-lg"
        style={{ background: "var(--preview-accent)" }}
      />
      {heroImage && (
        <div
          className="relative mb-3 h-14 w-full overflow-hidden"
          style={{
            borderRadius: "var(--preview-radius)",
            border: "1px solid color-mix(in srgb, var(--preview-primary) 20%, transparent)",
          }}
        >
          <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
        </div>
      )}
      {eyebrow && (
        <>
          <p className="relative mb-0.5 text-[7px] font-semibold uppercase tracking-wider" style={{ color: "var(--preview-accent)" }}>
            {eyebrow}
          </p>
          <div className="mb-2 h-[1px] w-6" style={{ backgroundColor: "var(--preview-accent)" }} />
        </>
      )}
      <h1 className={`relative font-bold leading-tight ${deviceMode === "mobile" ? "text-sm" : "text-lg"}`} style={{ color: "var(--preview-text)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="relative mt-1 text-[8px] leading-relaxed" style={{ color: "var(--preview-muted)" }}>
          {subtitle}
        </p>
      )}
      <span
        className="relative mt-3 inline-block px-3 py-1.5 text-[8px] font-semibold cursor-default"
        style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
      >
        {ctaLabel}
      </span>
    </section>
  );
}
