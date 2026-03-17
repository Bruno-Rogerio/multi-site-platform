"use client";

import { useWizard } from "../wizard-context";

export function PreviewEvents({ deviceMode }: { deviceMode: "desktop" | "mobile" }) {
  const { state } = useWizard();
  const { content, fontFamily, eventsVariant } = state;
  const events = (content.events as Array<{ title: string; date: string; time?: string; location?: string }> ?? [])
    .filter(e => e.title?.trim());

  if (events.length === 0) return null;

  const variant = eventsVariant || "timeline";
  const baseStyle = { fontFamily: fontFamily || "Inter" };

  function formatDateShort(dateStr: string) {
    if (!dateStr) return { day: "--", month: "---" };
    try {
      const d = new Date(dateStr + "T12:00:00");
      return {
        day: d.getDate().toString().padStart(2, "0"),
        month: d.toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
      };
    } catch { return { day: "--", month: "---" }; }
  }

  const displayed = events.slice(0, 3);

  if (variant === "cards") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.eventsTitle ?? "Agenda")}
        </h2>
        <div className={`grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
          {displayed.map((ev, i) => {
            const { day, month } = formatDateShort(ev.date);
            return (
              <div key={i} className="overflow-hidden rounded-lg" style={{ border: "1px solid color-mix(in srgb, var(--preview-primary) 30%, transparent)", backgroundColor: "color-mix(in srgb, var(--preview-primary) 5%, transparent)" }}>
                <div className="flex items-center gap-2 px-2.5 py-2">
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg text-white" style={{ backgroundColor: "var(--preview-primary)" }}>
                    <span className="text-[10px] font-black leading-none">{day}</span>
                    <span className="text-[7px] font-semibold">{month}</span>
                  </div>
                  <p className="text-[8px] font-semibold leading-snug" style={{ color: "var(--preview-text)" }}>{ev.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === "list") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.eventsTitle ?? "Agenda")}
        </h2>
        <div className="space-y-1.5">
          {displayed.map((ev, i) => {
            const { day, month } = formatDateShort(ev.date);
            return (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b" style={{ borderColor: "color-mix(in srgb, var(--preview-text) 10%, transparent)" }}>
                <div className="flex h-7 w-7 shrink-0 flex-col items-center justify-center rounded-md text-white" style={{ backgroundColor: "var(--preview-primary)" }}>
                  <span className="text-[9px] font-black leading-none">{day}</span>
                  <span className="text-[6px] font-semibold">{month}</span>
                </div>
                <p className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>{ev.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Timeline (default)
  return (
    <section className="px-3 py-4" style={baseStyle}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {String(content.eventsTitle ?? "Agenda")}
      </h2>
      <div className="relative space-y-2 pl-4">
        <div className="absolute left-1.5 top-0 bottom-0 w-px" style={{ backgroundColor: "color-mix(in srgb, var(--preview-primary) 30%, transparent)" }} />
        {displayed.map((ev, i) => (
          <div key={i} className="relative flex gap-2">
            <div className="absolute -left-[11px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--preview-primary)]" style={{ backgroundColor: "var(--preview-bg)" }} />
            <div className="rounded-lg px-2.5 py-1.5 flex-1" style={{ border: "1px solid color-mix(in srgb, var(--preview-primary) 25%, transparent)", backgroundColor: "color-mix(in srgb, var(--preview-primary) 5%, transparent)" }}>
              <p className="text-[8px] font-semibold" style={{ color: "var(--preview-text)" }}>{ev.title}</p>
              {ev.date && <p className="text-[6px] mt-0.5" style={{ color: "var(--preview-muted)" }}>{ev.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
