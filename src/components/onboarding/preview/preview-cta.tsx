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

  // ── banner: flex row, text left, button right (matches published) ──
  if (ctaVariant === "banner") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="flex items-center justify-between gap-2 p-3"
          style={{
            backgroundColor: "var(--preview-primary)08",
            borderRadius: "var(--preview-radius)",
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
            className="px-2 py-1 text-[7px] font-semibold text-white cursor-default shrink-0"
            style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius, color: "var(--preview-button-text)" }}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── centered: centered text with subtle border lines (matches published) ──
  if (ctaVariant === "centered") {
    return (
      <section
        className="px-3 py-4 text-center"
        style={{
          fontFamily: fontFamily || "Inter",
          borderTop: "2px solid var(--preview-primary)15",
          borderBottom: "2px solid var(--preview-primary)15",
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
          className="mt-2 inline-block px-2 py-1 text-[7px] font-semibold text-white cursor-default"
          style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius }}
        >
          {buttonLabel}
        </span>
      </section>
    );
  }

  // ── banner-gradient: gradient bg, flex layout (matches published) ──
  if (ctaVariant === "banner-gradient") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="flex items-center justify-between gap-2 p-3"
          style={{
            background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
            borderRadius: "var(--preview-radius)",
          }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-[10px] font-bold text-white">{title}</h2>
            {description && (
              <p className="text-[7px] mt-0.5 text-white/70 line-clamp-1">{description}</p>
            )}
          </div>
          <span
            className="px-2 py-1 text-[7px] font-semibold cursor-default shrink-0"
            style={{ backgroundColor: "white", color: "var(--preview-primary)", borderRadius: buttonRadius }}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // ── centered-gradient: gradient bg, centered, dot pattern (matches published) ──
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
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "8px 8px" }}
        />
        <h2 className="relative text-[10px] font-bold text-white">{title}</h2>
        {description && (
          <p className="relative text-[7px] mt-0.5 mx-auto max-w-[80%] text-white/70">{description}</p>
        )}
        <span
          className="relative mt-2 inline-block px-2 py-1 text-[7px] font-semibold cursor-default"
          style={{ backgroundColor: "white", color: "var(--preview-primary)", borderRadius: buttonRadius }}
        >
          {buttonLabel}
        </span>
      </section>
    );
  }

  // ── double: two buttons centered (matches published) ──
  if (ctaVariant === "double") {
    return (
      <section className="px-3 py-4 text-center" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {description && (
          <p className="text-[7px] mt-0.5 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
            {description}
          </p>
        )}
        <div className="mt-2 flex justify-center gap-2">
          <span
            className="px-2 py-1 text-[7px] font-semibold text-white cursor-default"
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

  // ── default: minimal/clean with border lines, outline button (matches published) ──
  return (
    <section
      className="px-3 py-4 text-center"
      style={{
        fontFamily: fontFamily || "Inter",
        borderTop: "1px solid var(--preview-text)15",
        borderBottom: "1px solid var(--preview-text)15",
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
