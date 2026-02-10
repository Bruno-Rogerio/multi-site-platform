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
      : buttonStyle === "soft"
      ? "12px"
      : "6px";

  const title = content.ctaTitle || "Vamos conversar?";
  const description = content.ctaDescription || "";
  const buttonLabel = content.ctaButtonLabel || "Entrar em contato";
  const buttonUrl = content.ctaButtonUrl || "";
  const secondaryLabel = content.ctaSecondaryLabel || "Saiba mais";
  const secondaryUrl = content.ctaSecondaryUrl || "";

  function CtaButton({ label, url, variant }: { label: string; url?: string; variant?: "outline" }) {
    if (variant === "outline") {
      return (
        <span
          className="px-3 py-1.5 text-[7px] font-semibold cursor-default"
          style={{
            color: "var(--preview-primary)",
            border: `1px solid var(--preview-primary)`,
            borderRadius: buttonRadius,
          }}
          title={url || undefined}
        >
          {label}
        </span>
      );
    }
    return (
      <span
        className="px-3 py-1.5 text-[7px] font-semibold text-white cursor-default"
        style={{ backgroundColor: "var(--preview-primary)", borderRadius: buttonRadius }}
        title={url || undefined}
      >
        {label}
      </span>
    );
  }

  // Variant: Banner
  if (ctaVariant === "banner") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="p-3 flex items-center justify-between gap-2"
          style={{
            borderRadius: "var(--preview-radius)",
            backgroundColor: `var(--preview-primary)10`,
            border: `1px solid var(--preview-primary)20`,
          }}
        >
          <div className="flex-1">
            <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
              {title}
            </h2>
            {description && (
              <p className="text-[7px] mt-0.5" style={{ color: "var(--preview-muted)" }}>
                {description}
              </p>
            )}
          </div>
          <CtaButton label={buttonLabel} url={buttonUrl} />
        </div>
      </section>
    );
  }

  // Variant: Banner Gradient (solid gradient background)
  if (ctaVariant === "banner-gradient") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <div
          className="p-3 flex items-center justify-between gap-2"
          style={{
            borderRadius: "var(--preview-radius)",
            background: `linear-gradient(135deg, var(--preview-primary), var(--preview-accent))`,
          }}
        >
          <div className="flex-1">
            <h2 className="text-[10px] font-bold text-white">
              {title}
            </h2>
            {description && (
              <p className="text-[7px] mt-0.5 text-white/70">
                {description}
              </p>
            )}
          </div>
          <span
            className="px-3 py-1.5 text-[7px] font-semibold cursor-default shrink-0"
            style={{
              backgroundColor: "white",
              color: "var(--preview-primary)",
              borderRadius: buttonRadius,
            }}
            title={buttonUrl || undefined}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // Variant: Centered
  if (ctaVariant === "centered") {
    return (
      <section className="px-3 py-4 text-center" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {description && (
          <p className="text-[7px] mt-1 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
            {description}
          </p>
        )}
        <div className="mt-2">
          <CtaButton label={buttonLabel} url={buttonUrl} />
        </div>
      </section>
    );
  }

  // Variant: Centered Gradient (solid gradient background, white text)
  if (ctaVariant === "centered-gradient") {
    return (
      <section
        className="px-3 py-6 text-center"
        style={{
          fontFamily: fontFamily || "Inter",
          background: `linear-gradient(135deg, var(--preview-primary), var(--preview-accent))`,
        }}
      >
        <h2 className="text-[10px] font-bold text-white">
          {title}
        </h2>
        {description && (
          <p className="text-[7px] mt-1 mx-auto max-w-[80%] text-white/70">
            {description}
          </p>
        )}
        <div className="mt-2">
          <span
            className="px-3 py-1.5 text-[7px] font-semibold cursor-default"
            style={{
              backgroundColor: "white",
              color: "var(--preview-primary)",
              borderRadius: buttonRadius,
            }}
            title={buttonUrl || undefined}
          >
            {buttonLabel}
          </span>
        </div>
      </section>
    );
  }

  // Variant: Double (two action buttons)
  if (ctaVariant === "double") {
    return (
      <section className="px-3 py-4 text-center" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {description && (
          <p className="text-[7px] mt-1 mx-auto max-w-[80%]" style={{ color: "var(--preview-muted)" }}>
            {description}
          </p>
        )}
        <div className="mt-2 flex justify-center gap-2">
          <CtaButton label={buttonLabel} url={buttonUrl} />
          <CtaButton label={secondaryLabel} url={secondaryUrl} variant="outline" />
        </div>
      </section>
    );
  }

  // Default fallback (banner style)
  return (
    <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
      <div
        className="p-3"
        style={{
          borderRadius: "var(--preview-radius)",
          backgroundColor: `var(--preview-primary)10`,
          border: `1px solid var(--preview-primary)20`,
        }}
      >
        <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="mt-2">
          <CtaButton label={buttonLabel} url={buttonUrl} />
        </div>
      </div>
    </section>
  );
}
