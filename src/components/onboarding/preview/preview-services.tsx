"use client";

import { useWizard } from "../wizard-context";
import * as LucideIcons from "lucide-react";

interface PreviewServicesProps {
  deviceMode: "desktop" | "mobile";
}

/* Shared style helpers for preview */
const cardBg = "color-mix(in srgb, var(--preview-primary) 10%, transparent)";
const cardBorder = "1px solid color-mix(in srgb, var(--preview-primary) 22%, transparent)";
const iconContainerBg = "linear-gradient(135deg, color-mix(in srgb, var(--preview-primary) 22%, transparent), color-mix(in srgb, var(--preview-accent) 18%, transparent))";

export function PreviewServices({ deviceMode }: PreviewServicesProps) {
  const { state, maxServiceCards } = useWizard();
  const { content, serviceCards, fontFamily, servicesVariant } = state;

  const title = content.servicesTitle || "Serviços";
  const cards = serviceCards.slice(0, maxServiceCards);

  const getIcon = (card: typeof cards[0]) => {
    const iconKey = card.icon || card.iconName;
    return iconKey
      ? (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>>)[iconKey]
      : null;
  };

  // ── minimal-list: vertical list with dividers ──
  if (servicesVariant === "minimal-list") {
    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 80% 60% at 0% 100%, color-mix(in srgb, var(--preview-primary) 8%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-2" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--preview-primary) 18%, transparent)" }}>
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            return (
              <div key={index} className="flex items-center gap-2 py-2">
                {Icon ? (
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                    style={{ background: iconContainerBg }}
                  >
                    <Icon size={10} style={{ color: "var(--preview-primary)" }} />
                  </div>
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--preview-accent)" }} />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-medium" style={{ color: "var(--preview-text)" }}>
                    {card.title || `Serviço ${index + 1}`}
                  </span>
                  {card.description && (
                    <p className="text-[6px] mt-0.5 truncate" style={{ color: "var(--preview-muted)" }}>
                      {card.description}
                    </p>
                  )}
                </div>
                {card.imageUrl && (
                  <div className="h-7 w-9 shrink-0 overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
                    <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ── columns: alternating icon + text rows ──
  if (servicesVariant === "columns") {
    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 70% 50% at 100% 0%, color-mix(in srgb, var(--preview-accent) 7%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold text-center mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="space-y-2">
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            const isReversed = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 overflow-hidden ${isReversed ? "flex-row-reverse" : ""}`}
                style={{
                  border: cardBorder,
                  backgroundColor: cardBg,
                  borderRadius: "var(--preview-radius)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {Icon && (
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: iconContainerBg }}
                  >
                    <Icon size={14} style={{ color: "var(--preview-primary)" }} />
                  </div>
                )}
                <div className={`flex-1 min-w-0 ${isReversed ? "text-right" : ""}`}>
                  <h3 className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                    {card.title || `Serviço ${index + 1}`}
                  </h3>
                  {card.description && (
                    <p className="text-[6px] mt-0.5 line-clamp-1" style={{ color: "var(--preview-muted)" }}>
                      {card.description}
                    </p>
                  )}
                </div>
                {card.imageUrl && (
                  <div className="h-9 w-12 shrink-0 overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
                    <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ── steps: numbered timeline ──
  if (servicesVariant === "steps") {
    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 60% 80% at 50% 100%, color-mix(in srgb, var(--preview-primary) 8%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="relative ml-0.5">
          {/* Timeline line with gradient */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-[1.5px]"
            style={{ background: "linear-gradient(to bottom, var(--preview-primary), var(--preview-accent))" }}
          />
          <div className="space-y-2">
            {cards.map((card, index) => {
              const Icon = getIcon(card);
              return (
                <div key={index} className="relative flex items-center gap-2">
                  <span
                    className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[6px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--preview-primary), var(--preview-accent))",
                      color: "var(--preview-button-text)",
                      boxShadow: "0 0 0 2px color-mix(in srgb, var(--preview-primary) 25%, transparent)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-1">
                      {Icon && <Icon size={9} style={{ color: "var(--preview-primary)" }} />}
                      <span className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                        {card.title || `Passo ${index + 1}`}
                      </span>
                    </div>
                    {card.description && (
                      <p className="text-[6px] mt-0.5 line-clamp-1" style={{ color: "var(--preview-muted)" }}>
                        {card.description}
                      </p>
                    )}
                  </div>
                  {card.imageUrl && (
                    <div className="h-8 w-10 shrink-0 overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
                      <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── masonry: staggered 2-column layout ──
  if (servicesVariant === "masonry") {
    const col1 = cards.filter((_, i) => i % 2 === 0);
    const col2 = cards.filter((_, i) => i % 2 === 1);

    const renderCard = (card: typeof cards[0], index: number, isTall: boolean) => {
      const Icon = getIcon(card);
      return (
        <div
          key={index}
          className="overflow-hidden"
          style={{
            border: cardBorder,
            backgroundColor: cardBg,
            borderRadius: "var(--preview-radius)",
            backdropFilter: "blur(4px)",
          }}
        >
          {card.imageUrl && (
            <div className="w-full overflow-hidden" style={{ height: isTall ? "36px" : "28px" }}>
              <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className={`p-2 ${isTall ? "pb-3" : ""}`}>
            {Icon && (
              <div
                className={`mb-1 inline-flex items-center justify-center rounded ${isTall ? "h-5 w-5" : "h-4 w-4"}`}
                style={{ background: iconContainerBg }}
              >
                <Icon size={isTall ? 12 : 9} style={{ color: "var(--preview-primary)" }} />
              </div>
            )}
            <h3 className={`font-semibold ${isTall ? "text-[9px]" : "text-[8px]"}`} style={{ color: "var(--preview-text)" }}>
              {card.title || `Serviço ${index + 1}`}
            </h3>
            {card.description && (
              <p className={`text-[6px] mt-0.5 ${isTall ? "" : "line-clamp-1"}`} style={{ color: "var(--preview-muted)" }}>
                {card.description}
              </p>
            )}
          </div>
        </div>
      );
    };

    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 80% 55% at 100% 50%, color-mix(in srgb, var(--preview-accent) 7%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {deviceMode === "mobile" ? (
          <div className="space-y-2">
            {cards.map((card, i) => renderCard(card, i, i % 3 === 0))}
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              {col1.map((card, i) => renderCard(card, i * 2, i % 2 === 0))}
            </div>
            <div className="flex-1 space-y-2 pt-3">
              {col2.map((card, i) => renderCard(card, i * 2 + 1, i % 2 === 1))}
            </div>
          </div>
        )}
      </section>
    );
  }

  // ── default: se há imagens usa layout horizontal, senão grid ──
  const hasAnyImage = cards.some((c) => c.imageUrl);

  if (hasAnyImage) {
    return (
      <section
        className="relative px-3 py-4 overflow-hidden"
        style={{
          fontFamily: fontFamily || "Inter",
          background: "radial-gradient(ellipse 60% 60% at 100% 50%, color-mix(in srgb, var(--preview-primary) 7%, transparent), transparent)",
        }}
      >
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="space-y-2">
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            const isReversed = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex items-center gap-2 overflow-hidden ${isReversed ? "flex-row-reverse" : ""}`}
                style={{
                  border: cardBorder,
                  backgroundColor: cardBg,
                  borderRadius: "var(--preview-radius)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="flex-1 p-2">
                  {Icon && (
                    <div
                      className="mb-1 inline-flex h-4 w-4 items-center justify-center rounded"
                      style={{ background: iconContainerBg }}
                    >
                      <Icon size={8} style={{ color: "var(--preview-primary)" }} />
                    </div>
                  )}
                  <h3 className="text-[8px] font-semibold leading-tight" style={{ color: "var(--preview-text)" }}>
                    {card.title || `Serviço ${index + 1}`}
                  </h3>
                  {card.description && (
                    <p className="text-[6px] mt-0.5 line-clamp-2" style={{ color: "var(--preview-muted)" }}>
                      {card.description}
                    </p>
                  )}
                </div>
                {card.imageUrl ? (
                  <div className="h-12 w-14 shrink-0 overflow-hidden" style={{ borderRadius: "var(--preview-radius)" }}>
                    <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="h-12 w-14 shrink-0 flex items-center justify-center"
                    style={{ background: iconContainerBg, borderRadius: "var(--preview-radius)" }}
                  >
                    <span className="text-[5px]" style={{ color: "var(--preview-primary)" }}>Img</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // grid simples quando não há imagens
  return (
    <section
      className="relative px-3 py-4 overflow-hidden"
      style={{
        fontFamily: fontFamily || "Inter",
        background: "radial-gradient(ellipse 70% 55% at 0% 100%, color-mix(in srgb, var(--preview-primary) 8%, transparent), transparent)",
      }}
    >
      {/* Subtle orb */}
      <div
        className="pointer-events-none absolute -right-4 top-0 h-12 w-12 rounded-full opacity-[0.12] blur-xl"
        style={{ background: "var(--preview-accent)" }}
      />
      <h2 className="relative text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {title}
      </h2>
      <div className={`relative grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
        {cards.map((card, index) => {
          const Icon = getIcon(card);
          return (
            <div
              key={index}
              className="overflow-hidden p-2 text-center"
              style={{
                border: cardBorder,
                backgroundColor: cardBg,
                borderRadius: "var(--preview-radius)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--preview-primary) 8%, transparent)",
              }}
            >
              {Icon && (
                <div
                  className="mx-auto mb-1 inline-flex h-5 w-5 items-center justify-center rounded"
                  style={{ background: iconContainerBg }}
                >
                  <Icon size={10} style={{ color: "var(--preview-primary)" }} />
                </div>
              )}
              <h3 className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                {card.title || `Serviço ${index + 1}`}
              </h3>
              {card.description && (
                <p className="text-[6px] mt-0.5 line-clamp-2" style={{ color: "var(--preview-muted)" }}>
                  {card.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
