"use client";

import { useWizard } from "../wizard-context";
import * as LucideIcons from "lucide-react";

interface PreviewServicesProps {
  deviceMode: "desktop" | "mobile";
}

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

  // ── minimal-list: vertical list with dividers (matches published) ──
  if (servicesVariant === "minimal-list") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold mb-2" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="divide-y" style={{ borderColor: "var(--preview-text)12" }}>
          {cards.map((card, index) => {
            const Icon = getIcon(card);
            return (
              <div key={index} className="flex items-start gap-2 py-2">
                {Icon ? (
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: "var(--preview-primary)15" }}>
                    <Icon size={9} style={{ color: "var(--preview-primary)" }} />
                  </div>
                ) : (
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--preview-accent)" }} />
                )}
                <div>
                  <span className="text-[8px] font-medium" style={{ color: "var(--preview-text)" }}>
                    {card.title || `Serviço ${index + 1}`}
                  </span>
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

  // ── columns: alternating icon + text rows (matches published) ──
  if (servicesVariant === "columns") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
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
                className={`flex items-center gap-2 p-2 border ${isReversed ? "flex-row-reverse" : ""}`}
                style={{
                  borderColor: "var(--preview-text)12",
                  backgroundColor: "var(--preview-text)04",
                  borderRadius: "var(--preview-radius)",
                }}
              >
                {Icon && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "var(--preview-primary)15" }}>
                    <Icon size={14} style={{ color: "var(--preview-primary)" }} />
                  </div>
                )}
                <div className={`flex-1 ${isReversed ? "text-right" : ""}`}>
                  <h3 className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                    {card.title || `Serviço ${index + 1}`}
                  </h3>
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

  // ── steps: numbered timeline (matches published) ──
  if (servicesVariant === "steps") {
    return (
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {title}
        </h2>
        <div className="relative ml-0.5">
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px]" style={{ backgroundColor: "var(--preview-primary)30" }} />
          <div className="space-y-2">
            {cards.map((card, index) => {
              const Icon = getIcon(card);
              return (
                <div key={index} className="relative flex items-start gap-2">
                  <span
                    className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[6px] font-bold text-white"
                    style={{ backgroundColor: "var(--preview-primary)" }}
                  >
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-1">
                      {Icon && <Icon size={9} style={{ color: "var(--preview-primary)" }} />}
                      <span className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>
                        {card.title || `Passo ${index + 1}`}
                      </span>
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
        </div>
      </section>
    );
  }

  // ── masonry: staggered 2-column layout (matches published) ──
  if (servicesVariant === "masonry") {
    const col1 = cards.filter((_, i) => i % 2 === 0);
    const col2 = cards.filter((_, i) => i % 2 === 1);

    const renderCard = (card: typeof cards[0], index: number, isTall: boolean) => {
      const Icon = getIcon(card);
      return (
        <div
          key={index}
          className="border overflow-hidden"
          style={{
            borderColor: "var(--preview-text)12",
            backgroundColor: "var(--preview-text)04",
            borderRadius: "var(--preview-radius)",
          }}
        >
          <div className={`p-2 ${isTall ? "pb-3" : ""}`}>
            {Icon && (
              <div className={`mb-1 inline-flex items-center justify-center rounded ${isTall ? "h-5 w-5" : "h-4 w-4"}`}
                style={{ backgroundColor: "var(--preview-primary)15" }}>
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
      <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
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

  // ── default (grid): 2-column grid with icon cards (matches published) ──
  return (
    <section className="px-3 py-4" style={{ fontFamily: fontFamily || "Inter" }}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {title}
      </h2>
      <div className={`grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
        {cards.map((card, index) => {
          const Icon = getIcon(card);
          return (
            <div
              key={index}
              className="border overflow-hidden p-2 text-center"
              style={{
                borderColor: "var(--preview-text)12",
                backgroundColor: "var(--preview-text)04",
                borderRadius: "var(--preview-radius)",
              }}
            >
              {Icon && (
                <div className="mx-auto mb-1 inline-flex h-5 w-5 items-center justify-center rounded"
                  style={{ backgroundColor: "var(--preview-primary)15" }}>
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
