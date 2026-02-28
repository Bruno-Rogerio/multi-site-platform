"use client";

import { useWizard } from "../wizard-context";

interface PreviewCtaProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewCta({ deviceMode }: PreviewCtaProps) {
  const { state } = useWizard();
  const { content, fontFamily, buttonStyle, ctaVariant } = state;

  const buttonRadius =
    buttonStyle === "pill"
      ? "9999px"
      : buttonStyle === "square"
      ? "0px"
      : "6px";

  const title = content.ctaTitle || "Vamos conversar?";
  const description = content.ctaDescription || "";
  const buttonLabel = content.ctaButtonLabel || "Entrar em contato";
  const secondaryLabel = content.ctaSecondaryLabel || "Saiba mais";

  // ── banner: flex row, text left, button right ──
  if (ctaVariant === "banner") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="flex items-center justify-between gap-2 p-3"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--preview-primary) 18%, transparent), color-mix(in srgb, var(--preview-accent) 10%, transparent))",
            border: "1px solid color-mix(in srgb, var(--preview-primary) 28%, transparent)",
            borderRadius: "var(--preview-radius)",
            boxShadow: "0 2px 12px color-mix(in srgb, var(--preview-primary) 14%, transparent)",
          }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
              {title}
            </h2>
            {description && (
              <p className="text-[7px] mt-0.5 line-clamp-1" style={{ color: "var(--preview-muted)" }}>
                {description}
              </p>
            )}
          </div>
          <span
            className="px-2 py-1 text-[7px] font-semibold cursor-default shrink-0"
            style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── centered: centered text with glassmorphism card ──
  if (ctaVariant === "centered") {
    return (
      <section
        className="relative px-3 py-4 text-center overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in srgb, var(--preview-primary) 8%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 rounded-full opacity-[0.15] blur-lg"
          style={{ background: "var(--preview-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-3 -right-3 h-8 w-8 rounded-full opacity-[0.12] blur-md"
          style={{ background: "var(--preview-accent)" }}
        />
        <div
          className="relative p-3"
          style={{
            border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)",
            borderRadius: "var(--preview-radius)",
            background: "color-mix(in srgb, var(--preview-primary) 8%, transparent)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 2px 12px color-mix(in srgb, var(--preview-primary) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
          }}
        >
          <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
            {title}
          </h2>
          {description && (
            <p className="text-[7px] mt-0.5 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
              {description}
            </p>
          )}
          <span
            className="mt-2 inline-block px-2 py-1 text-[7px] font-semibold cursor-default"
            style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── banner-gradient: gradient bg, flex layout ──
  if (ctaVariant === "banner-gradient") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="relative flex items-center justify-between gap-2 p-3 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
            borderRadius: "var(--preview-radius)",
          }}
        >
          {/* Dot texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "8px 8px" }}
          />
          {/* White orbs */}
          <div className="pointer-events-none absolute -right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white opacity-[0.15] blur-lg" />
          <div className="relative flex-1 min-w-0">
            <h2 className="text-[10px] font-bold text-white">{title}</h2>
            {description && (
              <p className="text-[7px] mt-0.5 text-white/70 line-clamp-1">{description}</p>
            )}
          </div>
          <span
            className="relative px-2 py-1 text-[7px] font-semibold cursor-default shrink-0 bg-white"
            style={{ color: "var(--preview-primary)", borderRadius: buttonRadius }}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── centered-gradient: gradient bg, centered, dot pattern ──
  if (ctaVariant === "centered-gradient") {
    return (
      <section
        className="relative overflow-hidden px-3 py-5 text-center"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "8px 8px" }}
        />
        {/* White orbs */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-white opacity-[0.14] blur-xl" />
        <div className="pointer-events-none absolute -bottom-4 -left-2 h-10 w-10 rounded-full bg-white opacity-[0.10] blur-lg" />
        <h2 className="relative text-[10px] font-bold text-white">{title}</h2>
        {description && (
          <p className="relative text-[7px] mt-0.5 mx-auto max-w-[80%] text-white/70">{description}</p>
        )}
        <span
          className="relative mt-2 inline-block px-2 py-1 text-[7px] font-semibold cursor-default bg-white"
          style={{ color: "var(--preview-primary)", borderRadius: buttonRadius }}
        >
          {buttonLabel}
        </span>
      </section>
    );
  }

  // ── double: two buttons centered ──
  if (ctaVariant === "double") {
    return (
      <section
        className="relative px-3 py-4 text-center overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, color-mix(in srgb, var(--preview-primary) 8%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -left-3 top-0 h-10 w-10 rounded-full opacity-[0.14] blur-lg"
          style={{ background: "var(--preview-primary)" }}
        />
        <div
          className="pointer-events-none absolute -right-3 bottom-0 h-8 w-8 rounded-full opacity-[0.12] blur-md"
          style={{ background: "var(--preview-accent)" }}
        />
        <h2 className="relative text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {description && (
          <p className="relative text-[7px] mt-0.5 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
            {description}
          </p>
        )}
        <div className="relative mt-2 flex justify-center gap-2">
          <span
            className="px-2 py-1 text-[7px] font-semibold cursor-default"
            style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
          >
            {buttonLabel}
          </span>
          <span
            className="px-2 py-1 text-[7px] font-semibold cursor-default"
            style={{
              color: "var(--preview-primary)",
              border: "1.5px solid var(--preview-primary)",
              borderRadius: buttonRadius,
            }}
          >
            {secondaryLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── default: minimal/clean with border lines, outline button ──
  return (
    <section
      className="relative px-3 py-4 text-center overflow-hidden"
      style={{
        fontFamily: fontFamily || "Inter",
        borderTop: "1.5px solid color-mix(in srgb, var(--preview-primary) 22%, transparent)",
        borderBottom: "1.5px solid color-mix(in srgb, var(--preview-primary) 22%, transparent)",
        background: "radial-gradient(ellipse 60% 80% at 50% 100%, color-mix(in srgb, var(--preview-primary) 6%, transparent), transparent)",
      }}
    >
      <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
        {title}
      </h2>
      {description && (
        <p className="text-[7px] mt-0.5 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
          {description}
        </p>
      )}
      <span
        className="mt-2 inline-block px-2 py-1 text-[7px] font-semibold cursor-default"
        style={{
          color: "var(--preview-primary)",
          border: "1.5px solid var(--preview-primary)",
          borderRadius: buttonRadius,
        }}
      >
        {buttonLabel}
      </span>
    </section>
  );
}
