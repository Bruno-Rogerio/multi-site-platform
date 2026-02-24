"use client";

import { useWizard } from "../wizard-context";
import * as LucideIcons from "lucide-react";

interface PreviewServicesProps {
  deviceMode: "desktop" | "mobile";
}

export function PreviewServices({ deviceMode }: PreviewServicesProps) {
  const { state, maxServiceCards } = useWizard();
  const { content, serviceCards, fontFamily, servicesVariant, servicesDisplayMode } = state;

  const title = content.servicesTitle || "Serviços";
  const subtitle = content.servicesSubtitle || "";
  const cards = serviceCards.slice(0, maxServiceCards);

  const getIcon = (card: typeof cards[0]) => {
    const iconKey = card.icon || card.iconName;
    return iconKey
      ? (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>>)[iconKey]
      : null;
  };

  // Variant: Minimal List
  if (servicesVariant === "minimal-list") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold mb-2" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="space-y-1">
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            return (
              <div key={index} className="flex items-center gap-2 py-1">
                {Icon && <Icon size={10} style={{ color: "var(--preview-primary)" }} />}
                <span className="text-[8px]" style={{ color: "var(--preview-text)" }}>
                  {card.title || `Serviço ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Variant: Columns (side-by-side comparison style)
  if (servicesVariant === "columns") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold text-center mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className={`flex gap-2 ${deviceMode === "mobile" ? "flex-col" : ""}`}>
          {cards.slice(0, 2).map((card, index) => {
            const Icon = getIcon(card);
            return (
              <div
                key={index}
                className="flex-1 p-2 text-center"
                style={{
                  borderRadius: "var(--preview-radius)",
                  backgroundColor: index === 0 ? `var(--preview-primary)10` : `var(--preview-accent)10`,
                  border: `1px solid ${index === 0 ? "var(--preview-primary)" : "var(--preview-accent)"}20`,
                  boxShadow: "var(--preview-shadow)",
                }}
              >
                {Icon && (
                  <div className="mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `var(--preview-${index === 0 ? "primary" : "accent"})20` }}>
                    <Icon size={12} style={{ color: `var(--preview-${index === 0 ? "primary" : "accent"})` }} />
                  </div>
                )}
                <h3 className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                  {card.title || `Opção ${index + 1}`}
                </h3>
                {card.description && (
                  <p className="text-[6px] mt-0.5" style={{ color: "var(--preview-muted)" }}>
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

  // Variant: Steps (numbered flow)
  if (servicesVariant === "steps") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="space-y-2">
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            return (
              <div key={index} className="flex items-start gap-2">
                <div
                  className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold text-white"
                  style={{ backgroundColor: "var(--preview-primary)" }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-1">
                    {Icon && <Icon size={10} style={{ color: "var(--preview-primary)" }} />}
                    <h3 className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                      {card.title || `Passo ${index + 1}`}
                    </h3>
                  </div>
                  {card.description && (
                    <p className="text-[6px] mt-0.5" style={{ color: "var(--preview-muted)" }}>
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Variant: Masonry (staggered heights with alternating tall/short)
  if (servicesVariant === "masonry") {
    // Split cards into 2 columns with staggered layout
    const col1 = cards.filter((_, i) => i % 2 === 0);
    const col2 = cards.filter((_, i) => i % 2 === 1);

    const renderMasonryCard = (card: typeof cards[0], index: number, isTall: boolean) => {
      const Icon = getIcon(card);
      return (
        <div
          key={index}
          className="border overflow-hidden"
          style={{
            borderColor: `var(--preview-text)18`,
            backgroundColor: `var(--preview-text)08`,
            borderRadius: "var(--preview-radius)",
            boxShadow: "var(--preview-shadow)",
          }}
        >
          {card.imageUrl && (
            <div className={isTall ? "h-14" : "h-8"}>
              <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className={`p-2 ${isTall ? "pb-4" : ""}`}>
            {Icon && (
              <div className={`mb-1.5 inline-flex items-center justify-center rounded ${isTall ? "h-7 w-7" : "h-5 w-5"}`} style={{ backgroundColor: `var(--preview-primary)20` }}>
                <Icon size={isTall ? 14 : 10} style={{ color: "var(--preview-primary)" }} />
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
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {deviceMode === "mobile" ? (
          <div className="space-y-2">
            {cards.map((card, i) => renderMasonryCard(card, i, i % 3 === 0))}
          </div>
        ) : (
          <div className="flex gap-2">
            {/* Column 1: starts tall */}
            <div className="flex-1 space-y-2">
              {col1.map((card, i) => renderMasonryCard(card, i * 2, i % 2 === 0))}
            </div>
            {/* Column 2: starts short (offset) */}
            <div className="flex-1 space-y-2 pt-3">
              {col2.map((card, i) => renderMasonryCard(card, i * 2 + 1, i % 2 === 1))}
            </div>
          </div>
        )}
      </section>
    );
  }

  // Default variant: Grid
  const isGrid = servicesDisplayMode === "grid";
  return (
    <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
      <div className="mb-3">
        <h2 className="text-[10px] font-bold" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[7px] mt-0.5" style={{ color: "var(--preview-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className={isGrid ? `grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}` : "space-y-2"}>
        {cards.map((card, index) => {
          const Icon = getIcon(card);
          return (
            <div
              key={index}
              className="border overflow-hidden"
              style={{
                borderColor: `var(--preview-text)18`,
                backgroundColor: `var(--preview-text)08`,
                borderRadius: "var(--preview-radius)",
                boxShadow: "var(--preview-shadow)",
              }}
            >
              {card.imageUrl && (
                <div className="h-10 w-full">
                  <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-2">
                {Icon && (
                  <div className="mb-1.5 inline-flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: `var(--preview-primary)25` }}>
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
