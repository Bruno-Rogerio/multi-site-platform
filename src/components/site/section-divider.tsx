type SectionDividerProps = {
  style?: string;
};

export function SectionDivider({ style }: SectionDividerProps) {
  if (!style || style === "none") return null;

  if (style === "wave") {
    return (
      <div className="w-full overflow-hidden pointer-events-none" style={{ height: "32px", marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0,16 C300,0 900,32 1200,16 L1200,32 L0,32 Z"
            fill="var(--site-primary)"
            opacity="0.06"
          />
        </svg>
      </div>
    );
  }

  if (style === "diagonal") {
    return (
      <div
        className="w-full pointer-events-none"
        style={{
          height: "32px",
          background: "var(--site-primary)",
          opacity: 0.05,
          clipPath: "polygon(0 0, 100% 40%, 100% 100%, 0 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  if (style === "curve") {
    return (
      <div className="w-full overflow-hidden pointer-events-none" style={{ height: "32px" }}>
        <svg
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <ellipse cx="600" cy="0" rx="700" ry="32" fill="var(--site-primary)" opacity="0.05" />
        </svg>
      </div>
    );
  }

  if (style === "line") {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 pointer-events-none" aria-hidden="true">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, color-mix(in srgb, var(--site-primary) 20%, transparent), transparent)",
          }}
        />
      </div>
    );
  }

  return null;
}
